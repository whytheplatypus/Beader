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

var gridCols = 6;
var gridRows = 24;
var beadHeight = 10;
var beadWidth = 16;

var ColorSquares = new Array();


var CurrentColor = "#000000";

function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function ColorBead(r, col, c){
	this.row = r;
	this.column = col;
	this.color = c
	this.drawn = false;
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

function load() {
  //grab the canvas
	canvasBeads = document.getElementById("cvBeads");

	canvasBeads.width = 3*(gridCols*beadWidth) + 0.5*beadWidth*gridRows + beadWidth;
	canvasBeads.height = beadHeight*(gridRows+3);

	canvasBeads.addEventListener('click', onMouseClickBead, false);
	

	ctxBeads = canvasBeads.getContext("2d");

	createGrid();
	
	var braceletList = document.createElement('select');
  braceletList.id = "bracelet_list";
	var savedBracelets = window.localStorage.getItem('names');
  if(savedBracelets){
    savedBracelets = savedBracelets.split(";");
  	for(var i = 0; i < savedBracelets.length; i++){
  	  var bracelet = document.createElement('option');
  	  bracelet.value = i;
  	  bracelet.innerHTML = savedBracelets[i];
  	  braceletList.appendChild(bracelet);
  	}
  }
	document.body.appendChild(braceletList);
	var loadButton = document.createElement('button');
	loadButton.innerHTML = "Load";
	loadButton.addEventListener('click', loadBracelet, false);
	document.body.appendChild(loadButton);
	
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

function save(){
  var bracelets = [];
  var names = [];
  if(window.localStorage.getItem('bracelets')){
    bracelets = window.localStorage.getItem('bracelets');
    bracelets = bracelets.split(";");
    names = window.localStorage.getItem('names');
    names = names.split(";");
  }
  var tempBeads = [ ];
  for(var i = 0; i < ColorBeads.length; i++){
    tempBeads.push(""+ColorBeads[i].row + "," + ColorBeads[i].column + "," + ColorBeads[i].color + "," + ColorBeads[i].drawn);
  }
  tempBeads = tempBeads.join(".");
  bracelets.push(tempBeads);
  names.push(document.querySelector('#saveas').value);
  try {
	 window.localStorage.setItem('bracelets', bracelets.join(";"));
	 window.localStorage.setItem('names', names.join(";"));
	} catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
		  alert("Quota exceeded!");
	  }
  }
  
  
  var bracelet = document.createElement('option');
  bracelet.value = names.length-1;
  bracelet.innerHTML = names[names.length-1];
  document.querySelector('#bracelet_list').appendChild(bracelet);
}

function loadBracelet(event){
  var bracelets = window.localStorage.getItem('bracelets');
  bracelets = bracelets.split(";");
  ColorBeads = bracelets[document.querySelector('#bracelet_list').selectedIndex];
  ColorBeads = ColorBeads.split(".");
  for(var i = 0; i < ColorBeads.length; i++){
    var attributes = ColorBeads[i].split(",");
    ColorBeads[i] = new ColorBead(attributes[0], attributes[1], attributes[2]);
    ColorBeads[i].drawn = attributes[3];
    ColorBeads[i].draw(ColorBeads[i].drawn == "true");
  }
  drawBracelet();
}

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
			ColorBeads[i].drawn = !event.ctrlKey;
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
