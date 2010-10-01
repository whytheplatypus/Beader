var canvasBeads, canvasColors, canvas3d, ctxBeads, ctxColors, ctx3d;

var commandIsDown = false;

var cursorX;
var cursorY;

var curEllipseMode = 4;
var RADIUS = 1;
var CORNERS = 2;
var CORNER = 3;
var CENTER = 4;

var padding = 10;

var ColorBeads = new Array();
//var gridSectionWidth = 420;
var gridCols = 6;
var gridRows = 24;
var beadHeight = 10;
var beadWidth = 16;

var ColorSquares = new Array();
//var colorSectionWidth = 180;
//var colorsPerCol = 5;
//var maxColors = 30;

//var colorWidth = 80;
//var colorHeight = 30;

var CurrentColor = "#000000";

function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

/*function ColorSquare(xCord, yCord, color, i) {
  //start each ColorSquare at a random position
	this.x = xCord;
	this.y = yCord;
	this.color = color;
	this.num = i;
}
ColorSquare.prototype.draw = function() {
	ctxColors.fillStyle = this.color;
	ctxColors.fillRect(this.x,this.y,colorWidth-30,colorHeight);
	ctxColors.fillStyle = "#000000";
	ctxColors.fillText("X", this.x+(colorWidth-14),this.y+colorHeight-12);
}
ColorSquare.prototype.clear = function() {
	ctxColors.fillStyle = this.color;
	ctxColors.clearRect(this.x,this.y,colorWidth,colorHeight);
}
function reset() {
	ColorSquares = new Array();
}

function addColor(color){
	if(ColorSquares.length < maxColors){
		var tempY = padding + (padding + colorHeight)*(ColorSquares.length % colorsPerCol);
		var tempX = (padding + colorWidth)*(Math.floor(ColorSquares.length/colorsPerCol));
		var newColor = new ColorSquare(tempX, tempY, color, ColorSquares.length);
		ColorSquares.push(newColor);
		refreshSquares();
	}
}
function deleteColor(n){
	ColorSquares.splice(n,1);
	for(var i = 0; i < ColorSquares.length; i++) {
		ColorSquares[i].x = ((padding + colorWidth)*(1 + Math.floor(i/colorsPerCol)));
		ColorSquares[i].y = padding + (padding + colorHeight)*(i % colorsPerCol);
	}
	refreshSquares();
}
function refreshSquares(){
	ctxColors.clearRect(0, 0, canvasColors.width, canvasColors.height);
	for(var i = 0; i < ColorSquares.length; i++) {
		ColorSquares[i].draw();
	}
}*/

function ColorBead(r, col, c){
	this.row = r;
	this.column = col;
	this.color = c
}
ColorBead.prototype.draw = function(doFill){
	ctxBeads.fillStyle = this.color;	
	var tempX, tempY;
	//middle grid
	tempX = padding + (gridCols*beadWidth + beadWidth/2) + this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = beadHeight*1.5 + this.row*(beadHeight);
	ctxBeads.strokeStyle = "#000000";
	ellipse(tempX, tempY, beadWidth, beadHeight, doFill, ctxBeads);
	//left grid
	tempX = padding + this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = (beadHeight/2) + this.row*(beadHeight);
	ctxBeads.strokeStyle = "#fff606";
	ellipse(tempX, tempY, beadWidth, beadHeight, doFill, ctxBeads);
	//right grid
	tempX = padding + (2*gridCols*beadWidth + beadWidth) + this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = 2.5*beadHeight + this.row*(beadHeight);
	ctxBeads.strokeStyle = "#fff606";
	ellipse(tempX, tempY, beadWidth, beadHeight, doFill, ctxBeads);
}
function createGrid(){
	ColorBeads = new Array(gridRows*gridCols);
	var i = 0;
	for(var k = 0; k < gridRows; k++){
		for(var l = 0; l < gridCols; l++){
			ColorBeads[i] = new ColorBead(k, l, "#ffffff");
			ColorBeads[i].draw(false);
			i++;
		}
	}
}
//draw the frames
/*function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < ColorSquares.length; i++) {
		ColorSquares[i].draw();
	}

	setTimeout(loop, padding);
}*/

function load() {
  //grab the canvas
	canvasBeads = document.getElementById("cvBeads");
	//canvasColors = document.getElementById("cvColors");
	//canvas3d = document.getElementById("cv3d");
	//gridRows gridCols beadHeight beadWidth
	canvasBeads.width = 3*(gridCols*beadWidth) + 0.5*beadWidth*gridRows + beadWidth;
	canvasBeads.height = beadHeight*(gridRows+3);
	//colorsPerCol colorWidth colorHeight maxColors
	//canvasColors.width = (maxColors/colorsPerCol)*(colorWidth+padding);
	//canvasColors.height = colorsPerCol*(colorHeight+padding)
	
	/*canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mouseover', onMouseEnter, false);
	canvas.addEventListener('mouseout', onMouseLeave, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mouseup', onMouseUp, false);*/
	//canvasColors.addEventListener('click', onMouseClickColor, false);
	canvasBeads.addEventListener('click', onMouseClickBead, false);
	
	//have the canvas fill the screen
	//canvas.height = document.body.offsetHeight;
	//canvas.width = document.body.offsetWidth;
	ctxBeads = canvasBeads.getContext("2d");
	//ctxColors = canvasColors.getContext("2d");
	createGrid();
	drawBracelet();
}

//from processing .js
function ellipse(x, y, width, height, doFill, ctx) {
	x = x || 0;
	y = y || 0;
	
	if (width <= 0 && height <= 0) {
	  return;
	}
	
	ctx.beginPath();
	
	if (curEllipseMode === RADIUS) {
	  width *= 2;
	  height *= 2;
	}
	
	if (curEllipseMode === CORNERS) {
	  width = width - x;
	  height = height - y;
	}
	
	if (curEllipseMode === CORNER || curEllipseMode === CORNERS) {
	  x += width / 2;
	  y += height / 2;
	}
	
	var offsetStart = 0;
	
	// Shortcut for drawing a circle
	if (width === height) {
	  ctx.arc(x - offsetStart, y - offsetStart, width / 2, 0, p.TWO_PI, false);
	} else {
	  var w = width / 2,
	    h = height / 2,
	    C = 0.5522847498307933;
	  var c_x = C * w,
	    c_y = C * h;
	
	  // TODO: Audit
	  ctx.moveTo(x + w, y);
	  ctx.bezierCurveTo(x + w, y - c_y, x + c_x, y - h, x, y - h);
	  ctx.bezierCurveTo(x - c_x, y - h, x - w, y - c_y, x - w, y);
	  ctx.bezierCurveTo(x - w, y + c_y, x - c_x, y + h, x, y + h);
	  ctx.bezierCurveTo(x + c_x, y + h, x + w, y + c_y, x + w, y);
	}
	if(doFill){
		ctx.fill();
	}
	else{
		ctx.stroke();
	}
	
	ctx.closePath();
}

function onMouseMove(event) {

}
//chase mouse
function onMouseEnter(event) {

}
//stop chasing and reset velocity
function onMouseLeave(event){

}
//stop chasing and start making
function onMouseDown(event){

}
//resume chasing
function onMouseUp(event){

}
function addColorButton(color){
  var newButton = document.createElement('button');
  newButton.style.background = color;
  newButton.innerHTML = color;
  newButton.addEventListener('click', colorButtonClick, false);
  document.getElementById("colors").appendChild(newButton);
}

function colorButtonClick(event){
  CurrentColor = event.target.innerHTML;
}

/*function onMouseClickColor(event){
  for(var i = 0; i < ColorSquares.length; i++){
		var buttonLeft = (canvasColors.width - (padding + colorWidth)*(1 + Math.floor(i/colorsPerCol)));
		var buttonRight = (canvasColors.width - (padding + colorWidth)*(1 + Math.floor(i/colorsPerCol))) + colorWidth - 30;
		var buttonTop = padding + (padding + colorHeight)*(i % colorsPerCol);
		var buttonBottom = padding + (padding + colorHeight)*(i % colorsPerCol) + colorHeight;
		if(event.clientY > buttonTop && event.clientY < buttonBottom){
			if(tempY > buttonLeft+canvasBeads.width){
				if(event.clientX < buttonRight+canvasBeads.width){
					//set current color to the color of the button
					CurrentColor = ColorSquares[i].color;
					break;
				}
				else if(event.clientX < buttonRight + 30+canvasBeads.width){
					//delete that button
					deleteColor(i);
					break;
				}
			}
		}
	}
}*/

function onMouseClickBead(event){
  getMouseXY(event);
	for(var i = 0; i < ColorBeads.length; i++){
		var beadLeft = padding + ColorBeads[i].column*(beadWidth) + ColorBeads[i].row*(beadWidth/2) - (beadWidth/2);
		var beadRight = beadLeft + (beadWidth);
		var beadTop = beadHeight/2 + ColorBeads[i].row*beadHeight - beadHeight/2;
		var beadBottom = beadHeight/2 + ColorBeads[i].row*beadHeight + beadHeight/2;
		var isLeft = tempX > beadLeft && tempX < beadRight && tempY < beadBottom && tempY > beadTop;
		var isMiddle = tempX > (beadLeft+(gridCols*beadWidth + beadWidth/2)) && tempX < (beadRight+(gridCols*beadWidth + beadWidth/2)) && tempY < (beadBottom+beadHeight) && tempY > (beadTop+beadHeight);
		var isRight = tempX > (beadLeft+(2*gridCols*beadWidth + beadWidth)) && tempX < (beadRight+(2*gridCols*beadWidth + beadWidth)) && tempY < (beadBottom+2*beadHeight) && tempY > (beadTop+2*beadHeight);
		if(isLeft || isMiddle || isRight){
			ColorBeads[i].color = "#ffffff";
			ColorBeads[i].draw(true);
			ColorBeads[i].color = CurrentColor;
			ColorBeads[i].draw(!event.ctrlKey);
			break;
		}
	}
	drawBracelet();
}
function aKeyDown(e) {
	e=window.event;
	if (e.keyCode==91) {commandIsDown=true;}
}

function aKeyUp(e) {
	e=window.event;
	if (e.keyCode==91) {commandIsDown=false;}
}
