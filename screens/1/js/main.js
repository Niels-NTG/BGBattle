// setup global vars
var TSPSConnection;
var socket = io('ws://192.168.1.124:4000');
//var socket = io('ws://192.168.1.162:3000');
var peopleArray = [];
//sequencer stuff
//matrix sequence settings
var instrumentList = [ "o_hi_hat", "hi_tom", "snare_drum",  "hand_clap", "bass_drum"];
var instrumentAssets = {};
instrumentAssets["o_hi_hat"] = {"colorOdd":"hsb(18, 100%, 80%)","colorEven":"hsb(18, 100%, 100%)","label":"TSS","iconWeight":4,"iconPoints":[[-20,20,0,30,0,30,20,20],[-25,30,0,40,0,40,25,30]],"iconType":"bezier"};
instrumentAssets["hi_tom"] = {"colorOdd":"hsb(130, 100%, 57%)","colorEven":"hsb(130, 100%, 77%)","label":"TOM","iconWeight":5,"iconPoints":[[-26,-15,-26,-35,30,8,30,-20]],"iconType":"bezier"};
instrumentAssets["snare_drum"] = {"colorOdd":"hsb(0, 0%, 60%)","colorEven":"hsb(0, 0%, 80%)","label":"TAK","iconWeight":4,"iconPoints":[[0,-13,0,-35],[-10,-10,-20,-28],[10,-10,20,-28]],"iconType":"lines"};
instrumentAssets["hand_clap"] = {"colorOdd":"hsb(57, 81%, 65%)","colorEven":"hsb(57, 81%, 85%)","label":"CLAP","iconWeight":4,"iconPoints":[[-5,-15,-20,-10],[-5,-21,-20,-27],[5,-15,20,-10],[5,-21,20,-27]],"iconType":"lines"};
instrumentAssets["bass_drum"] = {"colorOdd":"hsb(184, 100%, 60%)","colorEven":"hsb(184, 100%, 80%)","label":"BOOM","iconWeight":5,"iconPoints":[[-15,-10],[-20,-15],[-15,-15],[-15,-25],[-5,-15],[5,-25],[5,-15],[14,-15],[12,-10]],"iconType":"shape"};

var tickAmount = 8;
var paddingAmount = 0.01; // padding in percentages
var buttons = [];
var buttonWidth, buttonHeight, activeHeightArea;
//initialising the sequencer, remeber this is async, so you'll want to wait before just calling
//things inside the sequencer


function setup() {
    colorMode(HSB);
    createCanvas(windowWidth, windowHeight);
    myFont = loadFont('fonts/Raleway-ExtraBold.ttf');
    
}

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
                    buttons[i] = [];
                    var instrumentPresets = instrumentAssets[instrumentList[i]];
                    for (var t = 0; t < tickAmount; t++) {
                        buttons[i][t] = new Button();
                        buttons[i][t].instrumentIndex = i;
                        buttons[i][t].tickIndex = t;
//                        buttons[i][t].x = (width * 0.005) + (buttonWidth * t);
//                        buttons[i][t].y = (height * 0.005) + (buttonHeight * i);
//                        buttons[i][t].width = buttonWidth - (paddingAmount * width);
//                        buttons[i][t].height = buttonHeight - (paddingAmount * height);
                        buttons[i][t].x = buttonWidth * t;
                        buttons[i][t].y = buttonHeight * i;
                        buttons[i][t].width = buttonWidth;
                        buttons[i][t].height = buttonHeight;
//                        buttons[i][t].setColor("highlightcolor",((t % 2 == 0) ? "#fff" : "#aaa"));
                        buttons[i][t].socket = socket;
                        buttons[i][t].drumpcomp = drumcomp;
                        
                        buttons[i][t].setColor("playColor",((t % 2 == 0) ? instrumentPresets.colorEven : instrumentPresets.colorOdd));
                        buttons[i][t].text = instrumentPresets.label;
                        buttons[i][t].shapePoints = instrumentPresets.iconPoints;
                        buttons[i][t].iconType = instrumentPresets.iconType;
                        buttons[i][t].iconWeight = instrumentPresets.iconWeight;
                        
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



function draw() {
    clear();
    buttons.forEach(function (instrument, index) {
        instrument.forEach(function (tick, index) {
            tick.paint();
        })
    })
    peopleArray.forEach(function (person, index) {
        fill(0,20);
        ellipse(map(person.centroid.x, 0, 1, width, 0), map(person.boundingrect.y, 0, 1, height, 0), person.boundingrect.width * 32, person.boundingrect.height * 32);
//        text(index, map(person.centroid.x, 0, 1, width, 0), map(person.boundingrect.y, 0, 1, height, 0));
    });
    
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
    
}

function onPersonEntered(person) {
    person.personID = peopleArray.length + 1;
    peopleArray.push(person);
    //    console.log(peopleArray.length);
    updateCanvas(person);
    
}

function onPersonUpdated(person) {
    var xButton = Math.floor(map(person.centroid.x, 0, 1, width, 0) / buttonWidth);
    var yButton = Math.floor(map(person.boundingrect.y, 0, 1, height, 0) / buttonHeight);
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
}