var drumpreset, drumsetup, drumcomp;

function Button() {
    this.x;
    this.y;
    this.instrumentIndex;
    this.tickIndex;
    this.width;
    this.height;
    this.cornerradius = 0;
    this.aniMationTimer = 0;
    this.aniMationDuration = 20;
    this.direction = 0; // why not just a boolean?
    this.play = false;
    this.hit = false;
    this.hitTimer = 0;
    this.hitBuffer = 100;
    this.socket;
    this.drumcomp;
    this.highlightcolor = color("#fff");
    this.playColor;
    this.stoppedColor = color("#000");
    this.text;
    this.shapePoints;
    this.iconType;
    Button.prototype.paint = function () {
        if (this.play) {
            fill(this.playColor);
        }
        else {
            fill(this.stoppedColor);
        }
        rect(this.x, this.y, this.width, this.height, this.cornerradius);
        noFill();
        stroke(this.stoppedColor);
        strokeWeight(Math.floor(this.width * 0.05));
        rect(this.x + (this.width * 0.1), this.y + (this.height * 0.1), this.width * 0.8, this.height * 0.8, this.cornerradius);
        noStroke();
       
        
        if (this.aniMationTimer >= this.aniMationDuration ) {
                if (this.direction == 1) {
                    this.direction = -1;
                    this.aniMationTimer = 0;
                }
                else if (this.direction == -1) {
                    this.direction = 0;
                    this.aniMationTimer = 0;
                }
        }
        
        if (this.direction !== 0) {
            this.aniMationTimer++;
            var lerpValue = constrain(this.aniMationTimer / this.aniMationDuration,0,1);
            if (this.direction == -1) {
                lerpValue = 1 - lerpValue;
            }
            
//            var lerpC = color(this.highlightcolor, this.stoppedColor, lerpValue);
            fill(hue(this.highlightcolor), saturation(this.highlightcolor), brightness(this.highlightcolor), lerpValue*0.8);
            
//            if (this.tickIndex == 0 && this.instrumentIndex == 0) {
//                console.log(this.direction, hue(lerpC), saturation(lerpC), brightness(lerpC),lerpValue);
//            }
            rect(this.x, this.y, this.width, this.height, this.cornerradius);
        }
        
        //If the hit function isn't triggered before the next paint, we remove the hit
        push();
        translate(this.x + (this.width / 2), this.y + (this.height / 2));
        textAlign(CENTER, CENTER);
        rotate(-QUARTER_PI);
        if (!this.play) {
            fill(this.playColor);
            textSize(20);
        }
        else {
            fill(this.stoppedColor);
            textSize(25);
            stroke(this.stoppedColor);
            strokeWeight(2);
            
            if(this.iconType =="lines"){
                
                this.shapePoints.forEach(function(linePoints,index){
                    line(linePoints[0],linePoints[1],linePoints[2],linePoints[3]);
                })
            }else if(this.iconType =="shape"){
                noFill();
                beginShape();
                this.shapePoints.forEach(function(linePoints,index){
                    bezier(linePoints[0],linePoints[1], linePoints[2], linePoints[4]);
                });
                endShape();
            } else if(this.iconType =="bezier"){
                noFill();
                fill(255);
                strokeWeight(20);
                this.shapePoints.forEach(function(linePoints,index){
                    bezier(linePoints[0], linePoints[1], linePoints[2], linePoints[3], linePoints[4], linePoints[5], linePoints[6], linePoints[7]);
                });
            }
            fill(this.stoppedColor);
        }
        noStroke();
        textFont(myFont);
        text(this.text, 0, 0);
        pop();
        //LAAT DIT MET RUST
        //Hier willen we vast straks iets meer mee gaan doen.
        if (this.hit) {
            this.hitTimer++;
            if (this.hitTimer > this.hitBuffer) {
                this.hit = false;
                this.hitTimer = 0;
            }
        }
        //play indicator
    }
    Button.prototype.tick = function () {
        this.direction = 1;
        this.aniMationTimer = 0;
        //FIXME: match animation speed to Tempo
        this.aniMationDuration = ((drumcomp.getTempo() / 60) / 8) * frameRate();
        if (this.play) {
            this.socket.emit('application.message', {
                project: "techno portraits"
                , index: this.instrumentIndex
            });
        }
    }
    Button.prototype.setColor = function (type, colorString) {
            console.log(colorString);
            switch (type) {
            case "highlightcolor":
                this.highlightcolor = color(colorString);
                break;
            case "lowcolor":
                this.lowcolor = color(colorString);
                break;
            case "playColor":
                this.playColor = color(colorString);
                break;
            case "stoppedColor":
                this.stoppedColor = color(colorString);
                break;
            case "playColor":
                this.playColor = color(colorString);
                break;
            case "stoppedColor":
                this.stoppedColor = color(colorString);
                break;
            }
        }
        //    Button.prototype.toggle = function (state) {
        //        this.play = state;
        //    }
    Button.prototype.hitBtn = function () {
        //        console.log("hit", this.instrumentIndex, this.tickIndex);
        if (!this.hit) {
            this.hit = true;
            this.hitTimer = 0;
            //In de button class?
            if (this.play) {
                this.play = false;
            }
            else {
                this.play = true;
            }
            var toggleNumber = ((this.play) ? 1 : 0);
            this.drumpcomp.setSelectedInstrument(instrumentList[this.instrumentIndex]);
            this.drumpcomp.setStep(this.tickIndex * 2, toggleNumber);
        }
    }
}