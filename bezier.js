let controlPoints=[]
function setup() {
    createCanvas(900, 900);
    controlPoints.push(new ControlPoint(150,150,20))
    controlPoints.push(new ControlPoint(190,80,20))
    controlPoints[1].velocity.x=7
    controlPoints[1].velocity.x=7
    controlPoints[1].acceleration.x=-2
    controlPoints[1].acceleration.y=-2
    controlPoints.push(new ControlPoint(290,120,20))
    controlPoints.push(new ControlPoint(430,150,20))
    stroke(40,100,122);
  
}


function draw() {
    background(255);
    for(let i=0; i<controlPoints.length;i++){
        controlPoints[i].display()
    }

    for(let i=0; i<controlPoints.length;i++){
        if(controlPoints[i].followingMouse==true){
            controlPoints[i].setCoordinates(mouseX, mouseY)
        }
        controlPoints[i].x+=controlPoints[i].velocity.x
        controlPoints[i].y+=controlPoints[i].velocity.y
        controlPoints[i].velocity.x+=controlPoints[i].acceleration.x
        controlPoints[i].velocity.y+=controlPoints[i].acceleration.y
        
        if(controlPoints[i].velocity.x<0){
            controlPoints[i].velocity.x=0
        }
        if(controlPoints[i].velocity.y<0){
            controlPoints[i].velocity.y=0
        }

        if(controlPoints[i].acceleration.x>0){
            controlPoints[i].acceleration.x-=1
        }
        if(controlPoints[i].acceleration.y>0){
            controlPoints[i].acceleration.y-=1
        }

    }
    
    bezier(controlPoints[0].x,controlPoints[0].y,controlPoints[1].x,controlPoints[1].y,controlPoints[2].x,controlPoints[2].y,controlPoints[3].x,controlPoints[3].y)
}

function mousePressed(){
    let xm=mouseX;
    let ym=mouseY;

    for(let i=0; i<controlPoints.length;i++){
        if(controlPoints[i].isInBounds(xm,ym)){
            controlPoints[i].followingMouse=true
        }
    }
   

}

function mouseReleased(){
    for(let i=0; i<controlPoints.length;i++){
        if(controlPoints[i].followingMouse==true){
            controlPoints[i].followingMouse=false
        }
    }
}

class ControlPoint{
    constructor(x,y,radius){
        this.x=x
        this.y=y
        this.radius=radius
        this.followingMouse=false
        this.velocity=createVector(0,0)
        this.acceleration=createVector(0,0)
    }

    setCoordinates= function(x,y){
        this.x=x
        this.y=y
    }
    

    display= function(){
        circle(this.x, this.y, 20);
    }
    isInBounds= function(x,y){
        if(Math.sqrt(((this.x-x)*(this.x-x))+((this.y-y)*(this.y-y)))<this.radius){
            return true
        }
        else{
            return false
        }

    }
}