// setup global vars

var TSPSConnection;

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

    peopleArray.forEach(function(person, index) {
        ellipse(
            map(person.centroid.x, 0, 1, 0, width),
            map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height),
            person.boundingrect.width * 32,
            person.boundingrect.height * 32
        );
        text(
            index,
            map(person.centroid.x, 0, 1, 0, width),
            map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height)
        );
    });

    beginShape();
    peopleArray.forEach(function(person) {
        vertex(
            map(person.centroid.x, 0, 1, 0, width),
            map(person.boundingrect.y + person.boundingrect.height, 0, 2, 0, height)
        );
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
    console.log(person);
}

function onPersonEntered(person) {
    person.personID = peopleArray.length + 1;
    peopleArray.push(person);
    console.log(peopleArray.length);

    updateCanvas(person);
    socket.emit('application.message', peopleArray.length);
}

function onPersonUpdated(person) {
    console.log('person updated')
    updateCanvas(person);
}

function onPersonMoved(person) {
    console.log('person moved');
    updateCanvas(person);
}

function onPersonLeave(person) {
    peopleArray = peopleArray.filter(function(obj) {
        return obj.id !== person.id;
    });
    console.log(peopleArray.length);


    socket.emit('application.message', peopleArray.length);
}