let movables;
let boxes;
let MovableHeight;
let MovableWidth;
let imgSticks;
let imgBoxes;
let stickWidth;
let stickHeight;
let font;
let fontsize=30;
let possibleDevidends=[2,2,4,5,6,8,10];
let possibleDevisors=[2,2,4,4];
function preload() {
    font = loadFont('./3Dumb.ttf');
}

function setup() {
    // init & asset loading
    createCanvas(900, 900);
    movables=[]
    boxes=[]
    imgSticks= loadImage("./stick2.svg");
    imgBoxes= loadImage("./box4.png");
    
      // set up the font
    textFont(font);
    textSize(fontsize);



    stickWidth=70;
    stickHeight=80;
    let devidend= possibleDevidends[Math.floor(Math.random()*possibleDevidends.length)];
    let devisor=possibleDevisors[Math.floor(Math.random()*possibleDevisors.length)];
    MovableHeight=100;
    MovableWidth=70;
    for(i=0;i<devidend;i++){
        movables.push(new Movable((i*70)+200, 200));
    }
    print('devidend =',devidend)
    print('devisor =',devisor)
    for(i=0;i<devisor;i++){
        boxes.push(new Box((i*150)+200,500))
    }
}

function draw() {
    stroke(0);
    background(100)

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
                   }
                }
            }
            movables[i].followingMouse=false;
    }
}

function drawBox(){

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
        rect(this.x,this.y,150,150)
        image(imgBoxes,this.x, this.y, 150,150);
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