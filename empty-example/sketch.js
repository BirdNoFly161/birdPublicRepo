let slider;
let slider2;
function setup() {
  slider = createSlider(-100, 100,1,0.01);
  slider.position(10, 10);
  slider.style('width', '300px');
  slider2 = createSlider(-10, 10,0,0.1);
  slider2.position(10, 30);
  slider2.style('width', '300px');
  nbrCellsH=10
  nbrCellsV=10
  a=1
  b=0
  createCanvas(900, 900);
}

function drawAxis(){

  rect(0,0,width-1,height-1)
  stroke(0)
  line(0,height/2, width,height/2)
  line(width/2,0, width/2,height)
  cellWidth=Math.floor(width/nbrCellsH)
  cellHeight=Math.floor(height/nbrCellsV)
  stroke(100)

  for(i=0;i<nbrCellsH;i++){
    line(i*cellWidth,0,i*cellWidth,height)
  }

  for(i=0;i<nbrCellsV;i++){
    line(0,i*cellHeight,width,i*cellHeight)
  }
}

function drawPlot(){
  push();
  stroke(255,0,0);
  strokeWeight(3);
  translate(width/2, height/2)
  let step=width/nbrCellsH/2
  beginShape();
  for(i=-step;i<step;i=i+0.1){
    y=(i*i*slider.value())+slider2.value();
    curveVertex(i*nbrCellsH,-y*nbrCellsV)
  }
  endShape();
  pop();
}

function draw() {
  background(255);
  stroke(0);
  drawAxis();
  drawPlot();
}