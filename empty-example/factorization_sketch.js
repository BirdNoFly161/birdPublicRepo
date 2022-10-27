let movables;
let boxes;
let MovableHeight;
let MovableWidth;
let imgSticks;
let imgBoxes;
let imgBackground;
let stickWidth;
let stickHeight;
let font;
let fontsize=30;
let possibleDevidends=[2,4,12,6,8,10];
let possibleDevisors=[2,3,4,5];
let numberSticksPerBox;
let numberFullBoxes;
let devisor;
let devidend;
//coding train global variables 
const fireworks = [];
let gravity;
let song;

function preload() {
    font = loadFont('./assets/3Dumb.ttf');
}

function setup() {
    // init & asset loading
    createCanvas(900, 900);
    movables=[]
    boxes=[]
    imgSticks= loadImage("./assets/stick2.svg");
    imgBoxes= loadImage("./assets/box4.png");
    imgBoxesGreen= loadImage("./assets/boxGREEN.png");
    imgBoxesRed= loadImage("./assets/boxRED.png");
    imgBackground= loadImage("./assets/background.jpg");

    song = loadSound('./assets/clapping.wav');
    
      // set up the font
    textFont(font);
    textSize(fontsize);



    stickWidth=70;
    stickHeight=80;
    devidend= possibleDevidends[Math.floor(Math.random()*possibleDevidends.length)];
    for(i=possibleDevisors.length;i>=0;i--){
        print(`devidend=${devidend} and devisor=${possibleDevisors[i]} devidend%devisor=${devidend%possibleDevisors[i]}`)
        if(devidend%possibleDevisors[i]==0 && devidend!=possibleDevisors[i]){
            devisor=possibleDevisors[i]
            break;
        }
    }

    //compute total size of stick and total size of boxes to center them in the screen
    totalSizeSticks=devidend*stickWidth

    startingPositionSticksX=Math.floor(width/devidend/2)
    startingPositionSticksY=200

    startingPositionBoxesX=Math.floor(width/150+100)
    startingPositionBoxesY=500
    numberSticksPerBox=devidend/devisor;
    numberFullBoxes=0;
    MovableHeight=100;
    MovableWidth=70;
    for(i=0;i<devidend;i++){
        movables.push(new Movable((i*70)+startingPositionSticksX, startingPositionSticksY));
    }
    print('devidend =',devidend)
    print('devisor =',devisor)
    for(i=0;i<devisor;i++){
        boxes.push(new Box((i*150)+startingPositionBoxesX,startingPositionBoxesY))
    }
}

function draw() {
    stroke(0);
    background(255);
    image(imgBackground,0,0, width, height);
    print(numberFullBoxes)
    //display boxes
    for(let i=0;i<boxes.length;i++){
        boxes[i].display();
    }

        
    // display sticks
    for(let i=0;i<movables.length;i++){
        if(movables[i].followingMouse===true){
            movables[i].x=mouseX;
            movables[i].y=mouseY;
        }

        // this means i have to reset the sticks coordinates when it is taken out of the box
        if(movables[i].insideBox===false){
            image(imgSticks, movables[i].x, movables[i].y, stickWidth, stickHeight)
        }
    }

    if(numberFullBoxes===devisor){
        drawFireworks();
        if(!song.isPlaying()){
            song.play()
        }
    }
}

function mousePressed(){
    let xm=mouseX;
    let ym=mouseY;
    for(let i=0;i<movables.length;i++){
        if(xm>movables[i].x && xm<(movables[i].x+stickWidth) && ym>movables[i].y && ym<(movables[i].y+stickHeight)){
            // only start following mouse if already not in a box
            if(movables[i].insideBox===false){
                movables[i].followingMouse=true;
            }
            else{
                movables[i].followingMouse=true;
                movables[i].insideBox=false;
                if(boxes[movables[i].containingBox].number==numberSticksPerBox){
                    numberFullBoxes-=1
                }
                boxes[movables[i].containingBox].number=boxes[movables[i].containingBox].number-1
                break;
            }
        }
    }

}

function mouseReleased(){
    for(let i=0;i<movables.length;i++){
            if(movables[i].followingMouse===true){
                for(let j=0;j<boxes.length;j++){
                   if(boxes[j].isInBounds(movables[i].x, movables[i].y)){
                    boxes[j].number=boxes[j].number+1
                    movables[i].insideBox=true;
                    movables[i].containingBox=j;
                    movables[i].x=boxes[j].x;
                    movables[i].y=boxes[j].y;
                    if(boxes[j].number===numberSticksPerBox){
                        numberFullBoxes+=1
                    }

                   }
                }
            }
            movables[i].followingMouse=false;
    }
}

function drawFireworks(){
    gravity = createVector(0, 0.09);
    push();

    colorMode(RGB);
    if (random(1) < 0.04) {
        fireworks.push(new Firework());
      }
      
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        
        if (fireworks[i].done()) {
          fireworks.splice(i, 1);
        }
      }
    pop();
}

class Movable{
    constructor(x, y){
        this.x=x;
        this.y=y;
        this.containingBox=-1;
        this.followingMouse=false;
        this.insideBox=false;
        this.mousePressed= function (){
            this.startFollowingMouse()
        };
    }
}



// made class for Box since its display is composite (has a dynamic number to be displayed unlike other assets)
class Box{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.number=0
    }
    display= function(){
        //rect(this.x,this.y,150,150)
        if(this.number==numberSticksPerBox){
            image(imgBoxesGreen,this.x, this.y, 150,150);
        }
        else{
            if(this.number>numberSticksPerBox){
                image(imgBoxesRed,this.x, this.y, 150,150);
            }
            else{
                image(imgBoxes,this.x, this.y, 150,150);
            }
        }
        rect(this.x+55, this.y+135,40,40)
        text(this.number.toString(),this.x+65,this.y+165);
        //TODO
        //show image (or geometrically made box)
        //show number of sticks
    }

    isInBounds= function(xm,ym){
        if(xm>this.x && xm<this.x+150 && ym>this.y && ym<this.y+150){
            return true;
        }
        else{
            return false;
        }
    }
    
}




// coding train classes

class Particle {
    constructor(x, y, hu, firework) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 255;
      this.hu = hu;
      this.acc = createVector(0, 0);
      if (this.firework) {
        this.vel = createVector(0, random(-12, -8));
      } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, 10));
      }
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      if (!this.firework) {
        this.vel.mult(0.9);
        this.lifespan -= 4;
      }
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  
    done() {
      if (this.lifespan < 0) {
        return true;
      } else {
        return false;
      }
    }
  
    show() {
      colorMode(HSB);
  
      if (!this.firework) {
        strokeWeight(2);
        stroke(this.hu, 255, 255, this.lifespan);
      } else {
        strokeWeight(4);
        stroke(this.hu, 255, 255);
      }
  
      point(this.pos.x, this.pos.y);
    }
  }

  // Daniel Shiffman
// http://codingtra.in
// https://youtu.be/CKeyIbT3vXI

class Firework {
    constructor() {
      this.hu = random(255);
      this.firework = new Particle(random(width), height, this.hu, true);
      this.exploded = false;
      this.particles = [];
    }
  
    done() {
      if (this.exploded && this.particles.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  
    update() {
      if (!this.exploded) {
        this.firework.applyForce(gravity);
        this.firework.update();
  
        if (this.firework.vel.y >= 0) {
          this.exploded = true;
          this.explode();
        }
      }
  
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
  
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
    }
  
    explode() {
      for (let i = 0; i < 100; i++) {
        const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
        this.particles.push(p);
      }
    }
  
    show() {
      if (!this.exploded) {
        this.firework.show();
      }
  
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
    }
  }