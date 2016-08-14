// setup global vars
var TSPSConnection;

 var socket = io('ws://192.168.1.124:4000');
//var socket = io('ws://192.168.1.162:3000');

var portraitArray = [];

var isPaused = false;

var isAtractMode = false;
var attractModeTimer = 0;

function Portrait(images, animationDelay, instrumentName) {
	this.images = images;
	this.currentImage = this.images[0];
	this.animationDelay = animationDelay || 2;
	this.instrumentName = instrumentName;
	this.x = 0;
	this.y = 0;
	this.isTriggered = false;

	Portrait.prototype.resizeToFitImage = function(frameWidth, frameHeight) {
		this.images.forEach(function(image) {
			image.resize(frameWidth, 0);
		});
		this.y += (frameHeight - this.currentImage.height) / 2;
	}

	Portrait.prototype.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	Portrait.prototype.playAnimation = function() {
		this.isTriggered = true;
		if (frameCount % this.animationDelay === 0 && this.isTriggered) {
			var currentImageIndex = this.images.indexOf(this.currentImage);
			if (this.images[currentImageIndex + 1] !== undefined) {
				this.currentImage = this.images[currentImageIndex + 1];
			} else {
				this.resetAnimation();
			}
		}
	}

	Portrait.prototype.resetAnimation = function() {
		this.currentImage = this.images[0];
		this.isTriggered = false;
	}

}

// p5 preload
function preload() {
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/BR1336.png'),
			loadImage('img/portraits/BR1336_1.png'),
			loadImage('img/portraits/BR1336_2.png')
		],
		4,
		'TSS'
	));
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/0114.png'),
			loadImage('img/portraits/0114_1.png')
			// loadImage('img/portraits/0114_2.png')
		],
		4,
		'TOM'
	));
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/0019.png'),
			loadImage('img/portraits/0019_1.png'),
			loadImage('img/portraits/0019_2.png')
		],
		3,
		'TAK'
	));
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/clap.png'),
			loadImage('img/portraits/clap_1.png')
		],
		4,
		'CLAP'
	));
	portraitArray.push(new Portrait(
		[
			// loadImage('img/portraits/0025.png'),
			loadImage('img/portraits/0025_1.png'),
			loadImage('img/portraits/0025_2.png')
		],
		4,
		'BOOM'
	));
	// portraitArray.push(new Portrait(
	// 	[
	// 		loadImage('img/Rembrandt_van_Rijn_199.jpg'),
	// 		loadImage('img/Self-portrait_(1628-1629),_by_Rembrandt.jpg'),
	// 		loadImage('img/Piet_Mondrian,_1908-10,_Evening;_Red_Tree_(Avond;_De_rode_boom),_oil_on_canvas,_70_x_99_cm,_Gemeentemuseum_Den_Haag.jpg')
	// 	]
	// ));
	portraitArray.push(new Portrait(
		[
			loadImage('img/joined_without_BG.png')
		]
	));
}

// p5 setup
function setup() {
	createCanvas(windowWidth, windowHeight);
    myFont = loadFont('fonts/Raleway-ExtraBold.ttf');
    textSize(222);
    textAlign(LEFT, CENTER);
	colorMode(HSB);
	noStroke();
	frameRate(30);

	background(0);

	var row = 0;
	var col = 0;
	portraitArray.forEach(function(portrait, index) {
		if (index % 4 === 0 && index > 0) {
			row++;
			col = 0;
		}
		portrait.setPosition(
			(width / 4) * col,
			(height / 2) * row
		);
		if (portrait.instrumentName) {
			portrait.resizeToFitImage(width / 4, height / 2);
		}
		col++;
	});


	// portraitArray[portraitArray.length - 2].resizeToFitImage((width / 4) * 3, height / 2);
	// portraitArray[portraitArray.length - 1].x =+ width / 4;
	portraitArray[portraitArray.length - 1].resizeToFitImage((width / 4) * 3, height / 2);

}

// p5 draw
function draw() {
	background(0);
	textFont(myFont);

	if (isAtractMode) {
		fill(frameCount % 360, 100, 100);
		text(
			'BASIC GROOVES  ⁄  TECHNO PORTRAITS',
			width + (-frameCount % width) * 4,
			portraitArray[portraitArray.length - 3].y + (portraitArray[portraitArray.length - 3].currentImage.height / 2)
		);
	} else {
	// Branding
		noTint();
		image(
			portraitArray[portraitArray.length - 2].currentImage,
			portraitArray[portraitArray.length - 2].x,
			portraitArray[portraitArray.length - 2].y
		);
		tint((frameCount) % 360, 100, 100);
		image(
			portraitArray[portraitArray.length - 1].currentImage,
			portraitArray[portraitArray.length - 1].x,
			portraitArray[portraitArray.length - 1].y
		);
	}

	// Portraits
	noTint();
	portraitArray.forEach(function(portrait) {
		if (portrait.instrumentName) {
			if (portrait.isTriggered) {
				portrait.playAnimation();
			}
			image(portrait.currentImage, portrait.x, portrait.y);
		}
	});

	if (attractModeTimer > 1000 && !isAtractMode) {
		attractModeTimer = 0;
		isAtractMode = true;
	} else {
		attractModeTimer++;
	}

}

function keyPressed() {
	if (key === 'p' || key === 'P') {
		isPaused = !isPaused;
	}
	if (isPaused) {
		noLoop();
	} else {
		loop();
	}
	if (key === 'a' || key === 'A') {
		isAtractMode = !isAtractMode;
	}
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
	// TSPSConnection.onPersonEntered = onPersonEntered;
	// TSPSConnection.onPersonMoved = onPersonMoved;
	// TSPSConnection.onPersonUpdated = onPersonUpdated;
	// TSPSConnection.onPersonLeft = onPersonLeave;
});

socket.on('application.message', function(receivedData) {
	if (receivedData.project !== undefined && receivedData.project === 'techno portraits') {
		console.log(portraitArray[receivedData.index].instrumentName);
		portraitArray[receivedData.index].isTriggered = true;
		isAtractMode = false;
		attractModeTimer = 0;
		portraitArray[portraitArray.length - 2].playAnimation();
	}
});