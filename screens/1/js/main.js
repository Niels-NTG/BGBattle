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
            setup.loadSounds().then(function () {
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

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(LEFT, BOTTOM);
    fill(255);
    stroke('#3c3');
}

function draw() {
    clear();
    text(frameCount, 8, height - 8);
    peopleArray.forEach(function (person, index) {
        ellipse(map(person.centroid.x, 0, 1, 0, width), map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height), person.boundingrect.width * 32, person.boundingrect.height * 32);
        text(index, map(person.centroid.x, 0, 1, 0, width), map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height));
    });
    beginShape();
    peopleArray.forEach(function (person) {
        vertex(map(person.centroid.x, 0, 1, 0, width), map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height));
    });
    endShape(CLOSE);
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