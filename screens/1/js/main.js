// setup global vars
var TSPSConnection;
//sequencer stuff
var drumpreset, drumsetup, drumcomp;
//matrix sequence settings
var instrumentAmount = 3;
var tickAmount = 8;
var paddingAmount = 0.01; // padding in percentages
var buttons = new Array();
//initialising the sequencer, remeber this is async, so you'll want to wait before just calling 
//things inside the sequencer
var app = angular.module('9095App').directive('test', function (presetStorage, setup, sequencer) {
    return {
        link: function () {
            console.log("booyah");
            //Hier alle logica indrukken
            setup.loadSounds().then(function () {
                drumsetup = setup;
                drumpreset = presetStorage;
                drumcomp = sequencer;
                for (var i = 0; i <= 15; i++) {
                    //Een functie voor elke tick (0-15 ticks, 4 maten)
                    $('body').scope().$on('tick_' + i, function (event, data) {
                        var tick = event.name.replace("tick_", "");
                        if (tick % 2 == 0) {
                            tick = tick/2;
//                            console.log(tick,tick/2);
                            fireTick(tick);
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
    buttonWidth = windowWidth / tickAmount;
    var activeHeightArea = windowHeight * 0.75;
    buttonHeight = (activeHeightArea) / instrumentAmount;
    for (var i = 0; i < instrumentAmount; i++) {
        buttons[i] = new Array();
        for (var t = 0; t < tickAmount; t++) {
            buttons[i][t] = new Button();
            buttons[i][t].x = (buttonWidth * t);
            buttons[i][t].y = (buttonHeight * i);
            buttons[i][t].width = buttonWidth - (paddingAmount * windowWidth);
            buttons[i][t].height = buttonHeight - (paddingAmount * activeHeightArea);
            buttons[i][t].highlightcolor = ((t % 2 == 0) ? color("#f6f7d0") : color("#f2f2eb"));
            buttons[i][t].lowcolor = ((t % 2 == 0) ? color("#999") : color("#666"));
            console.log(buttons[i][t].x, buttons[i][t].y, buttons[i][t].width, buttons[i][t].height);
        }
    }
}

function Button() {
    this.x;
    this.y;
    this.width;
    this.height;
    this.cornerradius = 2;
    this.highlightcolor;
    this.lowcolor;
    this.aniMationTimer = 0;
    this.aniMationDuration = 20;
    this.direction = 0; // why not just a boolean?
    this.play = false;
    this.playColor = color("#d9534f");
    this.stoppedColor = color("#dddddd");
    Button.prototype.paint = function () {
        //Light up effect
        if (this.direction !== 0) {
            this.aniMationTimer++;
            var lerpValue = this.aniMationTimer / this.aniMationDuration;
            if (this.direction == -1) {
                lerpValue = 1 - this.lerpValue;
            }
            fill(lerpColor(this.highlightcolor, this.lowcolor, lerpValue));
        }
        else {
            fill(this.lowcolor);
        }
        rect(this.x, this.y, this.width, this.height, this.cornerradius);
        //play indicator
        if (this.aniMationTimer / this.aniMationDuration == 1) {
            if (this.direction == 1) {
                this.direction = -1;
                this.aniMationTimer = 0;
            }
            else if (this.direction == -1) {
                this.direction = 0;
                this.aniMationTimer = 0;
            }
        }
        if (this.play) {
            fill(this.playColor);
        }
        else {
            fill(this.stoppedColor);
        }
        //activated ridge
        rect(this.x + (this.width * 0.01), this.y + (this.height * 0.8), this.width * 0.98, this.height * 0.15, this.cornerradius);
    }
    Button.prototype.tick = function () {
        this.direction = 1;
        this.aniMationTimer = 0;
        //FIXME: match animation speed to Tempo
        this.aniMationDuration = ((drumcomp.getTempo() / 60) / 4) * frameRate();
    }
    Button.prototype.toggle = function (state) {
        this.play = state;
    }
}
var peopleArray = [];
var socket = io('ws://192.168.1.124:4000');

function draw() {
    clear();
    buttons.forEach(function (instrument, index) {
        instrument.forEach(function (tick, index) {
            tick.paint();
        })
    })
}

function fireTick(tIndex) {
    buttons.forEach(function (instrument, index) {
        if (instrument[tIndex] == undefined) {
            console.log(tIndex);
        }
        else {
            instrument[tIndex].tick();
        }
    })
}
$(document).ready(function () {
    console.log('ready');
    // coolDiv = $("#coolDiv");
    // coolDiv.remove(); //we're just going to use our cool div as a template
    // SETUP TSPS Connection
    TSPSConnection = new TSPS.Connection('192.168.1.241', '7681');
    // TSPSConnection = new TSPS.Connection('192.168.1.162', '7681');
    // IF YOU'VE CHANGED THE PORT:
    // TSPSConnection = new TSPS.Connection( "localhost", yourport )
    // IF YOU'RE CONNECTING TO ANOTHER MACHINE:
    // TSPSConnection = new TSPS.Connection( their IP, their TSPS port )
    TSPSConnection.connect();
    // add listeners
    TSPSConnection.onPersonEntered = onPersonEntered;
    TSPSConnection.onPersonMoved = onPersonMoved;
    TSPSConnection.onPersonUpdated = onPersonUpdated;
    TSPSConnection.onPersonLeft = onPersonLeave;
    $("body").click(function (e) {
        //We should prob create a function, i another file, that
        //sets the different patterns
        drumcomp.setSelectedInstrument('hand_clap');
        drumcomp.setStep(1, 1);
        drumcomp.setStep(2, 1);
        drumcomp.setStep(3, 1);
        //                        We should check if startPlay should be called again after each
        //                            change to the drumcomputer
        //                        console.log("tempo",drumcomp.getTempo());
        drumcomp.startPlay(true);
    })
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
    //    console.log('person updated')
    updateCanvas(person);
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