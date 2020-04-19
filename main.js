const WIDTH = 800
const HEIGHT = 600
const CELLSIZE = 20
const RANGE = CELLSIZE / 2
let grid
let veicules = []
let locked = false
let lockedValue = -1
let drawmodeActive = false
let debugModeActive = false
let gravity
const MAXSPEED = 3


// Veicule Object
function Veicule(x,y){
	this.pos = createVector(x,y)
	this.vel = createVector(0,0)
	this.acc = createVector(0,0)
	this.update = function(){
		this.pos.add(this.vel)
		this.vel.add(this.acc)
		this.vel.limit(MAXSPEED)
		if(this.pos.x > WIDTH || this.pos.x < 0){ this.pos.x = (this.pos.x + WIDTH) % WIDTH}
		if(this.pos.y > HEIGHT || this.pos.y < 0){ this.pos.y = (this.pos.y + HEIGHT) % HEIGHT}
		for(k=0;k<veicules.length;k++){
			distAB = dist(this.pos.x,this.pos.y,veicules[k].pos.x,veicules[k].pos.y)
			if(distAB<CELLSIZE*2 && distAB > 0){
/* 					console.log("veiculo perto")
					distX = abs(this.pos.x - veicules[k].pos.x)
					distY = abs(this.pos.y - veicules[k].pos.y)
					console.log(distX,distY)
					this.acc = createVector(distX,distY) */
			} else {
					let x = floor(this.pos.x/CELLSIZE)
					let y = floor(this.pos.y/CELLSIZE)*(width/CELLSIZE)
					this.acc.add(grid[x+y].flows)
			}
		}

	}
	this.draw = function(){
		fill(0,0,0,100)
		stroke(0)
		ellipse(this.pos.x,this.pos.y,CELLSIZE)
		line(this.pos.x,this.pos.y,this.pos.x+(this.vel.x)*5,this.pos.y+this.vel.y*5)
	}
}

// Cell Object
function Cell(x,y){
	this.x = x
	this.y = y
	this.content = 1
	this.flows = createVector(noise(x % HEIGHT)-0.5,noise(y % WIDTH)-0.5)      
	this.flip = function () {
		this.content ? this.content = 0 : this.content = 1
	}
	this.draw = function(){
		if(drawmodeActive==true){
			stroke(0)
			if (this.x + RANGE > (mouseX - RANGE) && this.x + RANGE < (mouseX + RANGE) &&
			this.y + RANGE > (mouseY - RANGE) && this.y + RANGE < (mouseY + RANGE)) {
				
				rect(this.x,this.y,CELLSIZE,CELLSIZE)
			} else {
				fill(255 * this.content)
				rect(this.x,this.y,CELLSIZE,CELLSIZE)
			}
		} else {
			noStroke()
			fill(255 * this.content)
			rect(this.x,this.y,CELLSIZE,CELLSIZE)
		}
		if(debugModeActive==true){
			stroke(0)
			ellipse(this.x,this.y,3,3)
			line(this.x,this.y,this.x+(this.flows.x*20),this.y+(this.flows.y*20))
		}
	}
}

function mousePressed() {
	if(drawmodeActive==true){
		if(mouseX<width && mouseX>00 && mouseY<height && mouseY>0){
			locked = true;
			let x = floor(mouseX/CELLSIZE)
			let y = floor(mouseY/CELLSIZE)*(width/CELLSIZE)
			grid[x+y].flip()
			lockedValue = grid[x+y].content;
		}
	} else {
		if(mouseX<width && mouseX>00 && mouseY<height && mouseY>0){
			veicules.push(new Veicule(mouseX, mouseY))
		}
	}
}

function mouseReleased() {
  locked = false
	lockedValue = -1
}

function mouseDragged() {
  if (locked) {
	if(mouseX<width && mouseX>00 && mouseY<height && mouseY>0){
		let x = floor(mouseX/CELLSIZE)
		let y = floor(mouseY/CELLSIZE)*(width/CELLSIZE)
		grid[x+y].content = lockedValue
	} 
  } else {
	if(mouseX<width && mouseX>00 && mouseY<height && mouseY>0){
		veicules.push(new Veicule(mouseX, mouseY))
	}
}
}

function drawMode() {
	drawmodeActive ? drawmodeActive = false : drawmodeActive = true
}

function forcesMode() {
	debugModeActive ? debugModeActive = false : debugModeActive = true
}

function initializeGrid() {
	grid = []
	for(i=0;i<(width*height/CELLSIZE)/CELLSIZE;i++){
		grid[i] = new Cell(i*CELLSIZE % width, floor(i * CELLSIZE / width) * CELLSIZE)
	}
}

function setup(){
	createCanvas(WIDTH, HEIGHT);
	//frameRate(15)
	initializeGrid()
	textFPS = createP()
	textFPS.position(WIDTH+75, 75)

	gravity = createVector(0,9.8)

/* 	buttonReset = createButton("Reset")
	buttonReset.position(WIDTH+75, 175)
	buttonReset.mousePressed(initializeGrid)

	buttonReset = createButton("Draw Mode")
	buttonReset.position(WIDTH+75, 200)
	buttonReset.mousePressed(drawMode) */

	buttonReset = createButton("Debug Mode")
	buttonReset.position(WIDTH+75, 225)
	buttonReset.mousePressed(forcesMode)
}


function draw(){
	for(i=0;i<grid.length;i++){
		grid[i].draw()
	}
	for(i=0;i<veicules.length;i++){
		veicules[i].draw()
		veicules[i].update()
	}
	textFPS.html('FPS: ' + floor(frameRate()))
}
