function Button() {
    this.x;
    this.y;
    this.instrumentIndex;
    this.tickIndex;
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
    this.hit = false;
    this.hitTimer = 0;
    this.hitBuffer = 100;
    this.socket;
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
        //Hier willen we vast straks iets meer mee gaan doen.
        if (this.hit) {
            this.hitTimer++;
            if(this.hitTimer>this.hitBuffer){
                this.hit = false;
                this.hitTimer=0;
            }
        } 
        //If the hit function isn't triggered before the next paint, we remove the hit
         
    }
    Button.prototype.tick = function () {
        this.direction = 1;
        this.aniMationTimer = 0;
        //FIXME: match animation speed to Tempo
        this.aniMationDuration = ((drumcomp.getTempo() / 60) / 4) * frameRate();
        if(this.play){
            this.socket.emit('application.instrument', this.instrumentIndex);
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
            drumcomp.setSelectedInstrument(instrumentList[this.instrumentIndex]);
            drumcomp.setStep(this.tickIndex, toggleNumber);
        }
    }
}