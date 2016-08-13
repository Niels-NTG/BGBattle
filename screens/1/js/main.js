// setup global vars
var TSPSConnection;
var socket = io('ws://192.168.1.124:4000');
//var socket = io('ws://192.168.1.162:3000');
var peopleArray = [];
//sequencer stuff
//matrix sequence settings
var instrumentList = ["bass_drum", "o_hi_hat", "snare_drum", "hand_clap", "crash"];
var tickAmount = 8;
var paddingAmount = 0.01; // padding in percentages
var buttons = [];
var buttonWidth, buttonHeight, activeHeightArea;
//initialising the sequencer, remeber this is async, so you'll want to wait before just calling
//things inside the sequencer
var app = angular.module('9095App').directive('test', function (presetStorage, setup, sequencer) {
    return {
        link: function () {
            //Hier alle logica indrukken
            setup.loadSounds().then(function () {
                drumsetup = setup;
                drumpreset = presetStorage;
                drumcomp = sequencer;
                sequencer.startPlay(true);
                buttonWidth = width / tickAmount;
                buttonHeight = height / instrumentList.length;
                for (var i = 0; i < instrumentList.length; i++) {
                    buttons[i] = new Array();
                    for (var t = 0; t < tickAmount; t++) {
                        buttons[i][t] = new Button();
                        buttons[i][t].instrumentIndex = i;
                        buttons[i][t].tickIndex = t;
                        buttons[i][t].x = (width * 0.005) + (buttonWidth * t);
                        buttons[i][t].y = (height * 0.005) + (buttonHeight * i);
                        buttons[i][t].width = buttonWidth - (paddingAmount * width);
                        buttons[i][t].height = buttonHeight - (paddingAmount * height);
                        buttons[i][t].highlightcolor = ((t % 2 == 0) ? color("#f6f7d0") : color("#f2f2eb"));
                        buttons[i][t].lowcolor = ((t % 2 == 0) ? color("#999") : color("#666"));
                        buttons[i][t].socket = socket;
                        buttons[i][t].drumpcomp = drumcomp;
                    }
                }
                for (var i = 0; i <= 15; i++) {
                    //Een functie voor elke tick (0-15 ticks, 4 maten)
                    $('body').scope().$on('tick_' + i, function (event, data) {
                        var tick = event.name.replace("tick_", "");
                        if (tick % 2 == 0) {
                            tick = tick / 2;
                            //                            console.log(tick,tick/2);
                            buttons.forEach(function (instrument, index) {
                                instrument[tick].tick();
                            })
                        }
                        //Hier de tick doorsturen (niet voor dit mozaiek maar voor muur scherm)
                        //Oplichting juiste tickrij
                    });
                }
            });
        }
    }
});

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    clear();
    buttons.forEach(function (instrument, index) {
        instrument.forEach(function (tick, index) {
            tick.paint();
        })
    })
    peopleArray.forEach(function (person, index) {
        ellipse(map(person.centroid.x, 0, 1, width, 0), map(person.boundingrect.y + person.boundingrect.height, 0, 2, height, 0), person.boundingrect.width * 32, person.boundingrect.height * 32);
        text(index, map(person.centroid.x, 0, 1, width, 0), map(person.boundingrect.y + person.boundingrect.height, 0, 2, height, 0));
    });
    beginShape();
    peopleArray.forEach(function (person) {
        vertex(map(person.centroid.x, 0, 1, width, 0), map(person.boundingrect.y + person.boundingrect.height, 0, 2, height, 0));
    });
    endShape(CLOSE);
}
$(document).ready(function () {
    // SETUP TSPS Connection
    TSPSConnection = new TSPS.Connection('192.168.1.241', '7681');
    // TSPSConnection = new TSPS.Connection('192.168.1.162', '7681');
    // IF YOU'VE CHANGED THE PORT:
    // TSPSConnection = new TSPS.Connection( "localhost", yourport )
    TSPSConnection.connect();
    // add listeners
    TSPSConnection.onPersonEntered = onPersonEntered;
    TSPSConnection.onPersonMoved = onPersonMoved;
    TSPSConnection.onPersonUpdated = onPersonUpdated;
    TSPSConnection.onPersonLeft = onPersonLeave;
});

function updateCanvas(person) {
    // console.log(person);
    getVertexLength();
}

function onPersonEntered(person) {
    person.personID = peopleArray.length + 1;
    peopleArray.push(person);
    //    console.log(peopleArray.length);
    updateCanvas(person);
    socket.emit('application.message', peopleArray.length);
}

function onPersonUpdated(person) {
    var xButton = Math.floor(map(person.centroid.x, 0, 1, width, 0) / buttonWidth);
    var yButton = Math.floor(map(person.boundingrect.y + person.boundingrect.height, 0, 2, height, 0) / buttonHeight);
    //    console.log(xButton, yButton);
    if (xButton < tickAmount && yButton < instrumentList.length) {
        buttons[yButton][xButton].hitBtn();
    }
}

function onPersonMoved(person) {
    //    console.log('person moved');
    updateCanvas(person);
}

function onPersonLeave(person) {
    peopleArray = peopleArray.filter(function (obj) {
        return obj.id !== person.id;
    });
    //    console.log(peopleArray.length);
    socket.emit('application.message', peopleArray.length);
}

function getVertexLength() {
    var vertexLength = 0;
    for (var i = 0; i < peopleArray.length - 1; i++) {
        vertexLength += dist(peopleArray[i].centroid.x, peopleArray[i].boundingrect.y + peopleArray[i].boundingrect.height, peopleArray[i + 1].centroid.x, peopleArray[i + 1].boundingrect.y + peopleArray[i + 1].boundingrect.height);
    }
    //    console.log(vertexLength);
    return vertexLength;
}