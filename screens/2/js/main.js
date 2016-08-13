// setup global vars
var TSPSConnection;
//sequencer stuff
var drumpreset, drumsetup, drumcomp;
//initialising the sequencer, remeber this is async, so you'll want to wait before just calling
//things inside the sequencer
var app = angular.module('9095App').directive('test', function (presetStorage, setup, sequencer) {
    return {
        link: function () {
            console.log("booyah");
            //Hier alle logica indrukken
            (function() {
                drumsetup = setup;
                drumpreset = presetStorage;
                drumcomp = sequencer;
                for (var i = 0; i <= 15; i++) {
                    //Een functie voor elke tick (0-15 ticks, 4 maten)
                    $('body').scope().$on('tick_' + i, function (event, data) {
                        console.log(event)
                    });
                }
            });
        }
    }
});

function testGlobal() {
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
}
var peopleArray = [];
var socket = io('ws://192.168.1.124:4000');

var portraitArray = [];

function Portrait(image, sound) {
    this.image = image;
    this.sound = sound;
    this.x;
    this.y;

    Portrait.prototype.resizeToFitImage = function(frameWidth, frameHeight) {
        this.image.resize(frameWidth, 0);
    }

    Portrait.prototype.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Portrait.prototype.playSound = function() {

    }
}

// p5 preload
function preload() {
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0019.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0024.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0025.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0109.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0110.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0114.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0115.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0116.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0129.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0130.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0133.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0172.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0270.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0331.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0514.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0515.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0698 A.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/0698 B.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/2573.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/2611.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/2622.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/3884.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/BR1336.jpg')
    ));
    portraitArray.push(new Portrait(
        loadImage('img/portraits/BR2100.jpg')
    ));
}

// p5 setup
function setup() {
    createCanvas(windowWidth, windowHeight);

    var row = 0;
    var col = 0;
    portraitArray.forEach(function(portrait, index) {
        portrait.resizeToFitImage(width / 8, height / 4);
        if (index % 8 === 0 && index > 0) {
            row++;
            col = 0;
        }
        portrait.setPosition(
            (width / 8) * col,
            (height / 4) * row
        );
        col++;
    });

    textAlign(LEFT, BOTTOM);
    fill(255);
    stroke('#3c3');
}

// p5 draw
function draw() {
    // clear();
    portraitArray.forEach(function(portrait) {
        image(portrait.image, portrait.x, portrait.y);
    });
}

$(document).ready(function () {
    console.log('ready');
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
});

function updateCanvas(person) {
    // console.log(person);
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