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

function Portrait(images, sound) {
    this.images = images;
    this.currentImage = this.images[0];
    this.animationDelay = 2;
    this.x = 0;
    this.y = 0;
    this.sound = sound;

    Portrait.prototype.resizeToFitImage = function(frameWidth, frameHeight) {
        this.images.forEach(function(image) {
            image.resize(frameWidth, 0);
            this.y += (frameHeight - image.height);
        });
    }

    Portrait.prototype.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    }

    Portrait.prototype.playSound = function() {

    }

    Portrait.prototype.playAnimation = function() {
        if (frameCount % this.animationDelay === 0) {
            var currentImageIndex = this.images.indexOf(this.currentImage);
            if (this.images[currentImageIndex + 1] !== undefined) {
                this.currentImage = this.images[currentImageIndex + 1];
            } else {
                this.currentImage = this.images[0];
            }
        }
    }
}

// p5 preload
function preload() {
    portraitArray.push(new Portrait(
        [
            loadImage('img/portraits/0019.jpg'),
            loadImage('img/portraits/0019_1.png'),
            loadImage('img/portraits/0019_2.png')
        ]
    ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0024.jpg')]
    // ));
    portraitArray.push(new Portrait(
        [
            loadImage('img/portraits/0025.png'),
            loadImage('img/portraits/0025_1.png'),
            loadImage('img/portraits/0025_2.png')
        ]
    ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0109.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0110.jpg')]
    // ));
    portraitArray.push(new Portrait(
        [
            loadImage('img/portraits/0114.png'),
            loadImage('img/portraits/0114_1.png'),
            loadImage('img/portraits/0114_2.png')
        ]
    ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0115.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0116.jpg')]
    // ));
    portraitArray.push(new Portrait(
        [
            loadImage('img/portraits/0129.jpg'),
            loadImage('img/portraits/0129_1.png'),
            loadImage('img/portraits/0129_2.png')
        ]
    ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0130.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0133.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0172.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0270.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0331.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0514.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0515.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0698 A.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/0698 B.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/2573.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/2611.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/2622.jpg')]
    // ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/3884.jpg')]
    // ));
    portraitArray.push(new Portrait(
        [
            loadImage('img/portraits/BR1336.jpg'),
            loadImage('img/portraits/BR1336_1.png'),
            loadImage('img/portraits/BR1336_2.png')
        ]
    ));
    // portraitArray.push(new Portrait(
    //     [loadImage('img/portraits/BR2100.jpg')]
    // ));
}

// p5 setup
function setup() {
    createCanvas(windowWidth, windowHeight);

    frameRate(30);

    background(0);

    var row = 0;
    var col = 0;
    portraitArray.forEach(function(portrait, index) {
        if (index % 3 === 0 && index > 0) {
            row++;
            col = 0;
        }
        portrait.setPosition(
            (width / 3) * col,
            (height / 2) * row
        );
        portrait.resizeToFitImage(width / 3, height / 2);
        col++;
    });
}

// p5 draw
function draw() {
    background(0);
    portraitArray.forEach(function(portrait) {
        image(portrait.currentImage, portrait.x, portrait.y);
        portrait.playAnimation();
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