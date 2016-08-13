// setup global vars
var TSPSConnection;

var socket = io('ws://192.168.1.124:4000');

var portraitArray = [];

var isPaused = false;

var isAtractMode = true;

function Portrait(images) {
	this.images = images;
	this.currentImage = this.images[0];
	this.animationDelay = 2;
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
			loadImage('img/portraits/0025.png'),
			loadImage('img/portraits/0025_1.png'),
			loadImage('img/portraits/0025_2.png')
		]
	));
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/BR1336.jpg'),
			loadImage('img/portraits/BR1336_1.png'),
			loadImage('img/portraits/BR1336_2.png')
		]
	));
	portraitArray.push(new Portrait(
		[
			loadImage('img/portraits/0114.png'),
			loadImage('img/portraits/0114_1.png'),
			loadImage('img/portraits/0114_2.png')
		]
	));
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
	// portraitArray.push(new Portrait(
	//     [loadImage('img/portraits/0109.jpg')]
	// ));
	// portraitArray.push(new Portrait(
	//     [loadImage('img/portraits/0110.jpg')]
	// ));
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

	// portraitArray.push(new Portrait(
	//     [loadImage('img/portraits/BR2100.jpg')]
	// ));
	portraitArray.push(new Portrait(
		[
			loadImage('img/02_BG_2016_white.png')
		]
	));
}

// p5 setup
function setup() {
	createCanvas(windowWidth, windowHeight);

	colorMode(HSB);
	// frameRate(30);

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
		portrait.resizeToFitImage(width / 4, height / 2);
		col++;
	});
}

// p5 draw
function draw() {
	background(0);
	noTint();

	// Portraits
	portraitArray.forEach(function(portrait) {
		if (portrait.isTriggered) {
			portrait.playAnimation();
		}
		image(portrait.currentImage, portrait.x, portrait.y);
	});

	// Branding
	tint(frameCount % 360, 100, 100);
	image(
		portraitArray[portraitArray.length - 1].currentImage,
		portraitArray[portraitArray.length - 1].x,
		portraitArray[portraitArray.length - 1].y
	);

	// Attract mode
	// if (isAtractMode) {
	// 	background(0);
	// }

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

socket.on('application.message', function(instrumentIndex) {
	// console.log(instrumentIndex);
	portraitArray[instrumentIndex].playAnimation();
});