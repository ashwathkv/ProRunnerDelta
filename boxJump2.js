const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d");



const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

let preset = 1000;

let enemySpeed = 5.5;

let score = 0;
let scoreIncrement = 0;

let canScore = true;

function startGame() {
    player = new Player(150,350,50,"red");
    arrayBlock = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 5.5;
    canScore = true;
    preset = 1000;
}


function restartGame(button) {
    card.style.display = "none" ;
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}


function drawBackgroundLine() {  // This function is used to draw the ground from the point (0,400) to the point (600,400)
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,600,190); 
    ctx.fillStyle = "black";
    ctx.fillRect(0,400,600,190); 
    ctx.fillStyle = "#7F7F7F";
    ctx.fillRect(0,180,600,220); 
    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.lineTo(600,400);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "#7F7F7F";
    ctx.stroke();
}
function drawBackgroundLine2() {  // This function is used to draw the ground from the point (0,400) to the point (600,400)
    ctx.beginPath();
    ctx.moveTo(0,180);
    ctx.lineTo(600,180);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "#7F7F7F";
    ctx.stroke();
}

function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "white";
    let scoreString = score.toString();
    let xoffset = (scoreString.length - 1)* 20;
    ctx.fillText(scoreString,280 - xoffset,100);
}


function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumberInterval(timeInterval) {

    let returnTime = timeInterval;
    if(Math.random() < 0.5) {
        returnTime = getRandomNumber(preset / 3, preset * 1.5);
    }
    else {
        returnTime -= getRandomNumber(preset / 5, preset / 2);
    }
    return returnTime;
}


class Player {


    constructor(x,y,size,color) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = size;
        this.color = color;
        // these three are used to configure the jump
        this.jumpHeight = 12; //this will be the maximum height of jump
        this.shouldJump = false;
        this.jumpCount = 0;// we are going to use a total of 32 framses for the total jump. 14 for take off, 4 for mid air, and 14 for landing. 
                            //this jump count will count the number of frames the animation takes place and checks if it is 32
        
        this.spin = 0;
        this.spinIncrement = 90 / 32 ; // for triangle use 60 instead of 90 and instead of 32 we should use 14 as we are performing one direction motion only
    }

rotation() {
    let offsetXPosition = this.x + (this.size / 2);
    let offsetYPosition = this.y + (this.size / 2);
    ctx.translate(offsetXPosition,offsetYPosition);
    ctx.rotate(this.spin * Math.PI / 180);
    ctx.rotate(this.spinIncrement * Math.PI / 180);
    ctx.translate(-offsetXPosition,-offsetYPosition);
    this.spin += this.spinIncrement;
}    

couunterRotation() {
    let offsetXPosition = this.x + (this.size / 2);
    let offsetYPosition = this.y + (this.size / 2);
    ctx.translate(offsetXPosition,offsetYPosition);
    ctx.rotate(-this.spin * Math.PI / 180);
    ctx.translate(-offsetXPosition,-offsetYPosition);
}

gety() {
     console.log(this.y);
    return this.y;
}

jumpDown() {

        if(this.shouldJump) {
            this.jumpCount++;
            
            if(this.jumpCount < 15)//go up
            {
                this.y += this.jumpHeight;
            }
            else if(this.jumpCount > 14 /*&& this.jumpCount < 19*/)//stay there
            {
                this.y += 0;
            }
            
            this.rotation();
            //End the cycle
            if(this.jumpCount >= 14){
                this.couunterRotation();
                this.spin = 0;
                this.shouldJump = false;
                this.jumpHeight = -this.jumpHeight;
            }

        }

    }

    jumpUp() {

        if(this.shouldJump) {
            this.jumpCount++;
            
            if(this.jumpCount < 15)//go up
            {
                this.y -= this.jumpHeight;
            }
            else if(this.jumpCount > 14 /*&& this.jumpCount < 19*/)//stay there
            {
                this.y += 0;
            }
            
            this.rotation();
            //End the cycle
            if(this.jumpCount >= 14){
                this.couunterRotation();
                this.spin = 0;
                this.shouldJump = false;
                this.jumpHeight = -this.jumpHeight;
            }

        }

    }
    
    drawUp() {
        
        this.jumpUp();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
        if(this.shouldJump) this.couunterRotation();
        
    }

    drawDown() {
        
        this.jumpDown();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
        if(this.shouldJump) this.couunterRotation();
        
    }


}

class AvoidBlock1 {
    constructor(size,speed) {
        this.x = canvas.width + size;
        this.y = 399;
        this.size = size;
        this.color = "#7F7F7F";
        // this.color = "black";
        this.slideSpeed = speed;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
}

class AvoidBlock2 {
    constructor(size,speed) {
        this.x = canvas.width + size;
        this.y = 135 ;
        this.size = size;
        this.color = "#7F7F7F";
        this.slideSpeed = speed;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
}

let player = new Player(150,350,50,"red");

let arrayBlock1 = [];
let arrayBlock2 = [];

function generateBlocks() {
    let timeDelay = randomNumberInterval(preset);
    arrayBlock1.push(new AvoidBlock1(50,enemySpeed));
    setTimeout(generateBlocks, timeDelay);
}
function generateBlocks2() {
    let timeDelay = randomNumberInterval(preset);
    arrayBlock2.push(new AvoidBlock2(50,enemySpeed));
    setTimeout(generateBlocks2, timeDelay);
}


function squareColliding(player , block) {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)),player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)),block);
    // s2.size = s2.size - 5;
    // s2.x = s2.x + 5;
    // s2.y = s2.y + 5;
    return !(
        s1.x > s2.x + s2.size || // R1 is to the right of R2
        s1.x + s1.size < s2.x || //R1 is to the left of R2
        s1.y > s2.y + s2.size || //R1 is below R2
        s1.y + s1.size <= s2.y //R1 is above R2
    )
}

function isPastBlock(player, block) {
    return (
        player.x + (player.size / 2) > block.x + (block.size / 4) &&
        player.x + (player.size / 2) < block.x + (block.size / 4)*3
    )
}

let animationId = null;


function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //canvas logic
    drawBackgroundLine();
    drawBackgroundLine2();
    drawScore();
    
    player.drawUp();
    

    arrayBlock1.forEach(arrayBlock1 => {
        arrayBlock1.slide();
        if(squareColliding(player , arrayBlock1)){
            cardScore.textContent = score;
            card.style.display = "block" ;
            
            cancelAnimationFrame(animationId);
        }

        if(isPastBlock(player , arrayBlock1) && canScore) {
            canScore = false;
            score++;
        }
    })
    arrayBlock2.forEach(arrayBlock2 => {
        arrayBlock2.slide();
        if(squareColliding(player , arrayBlock2)){
            cardScore.textContent = score;
            card.style.display = "block" ;
            
            cancelAnimationFrame(animationId);
        }

        if(isPastBlock(player , arrayBlock2) && canScore) {
            canScore = false;
            score++;
        }
    })
}

animate(); //function calling

setTimeout(() => {
    generateBlocks();

}, randomNumberInterval(preset));

setTimeout(() => {
    generateBlocks2();

}, randomNumberInterval(preset));

addEventListener("keydown", e => {
    if(e.code === "Space") {
        if(!player.shouldJump){
            player.jumpCount = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
});
