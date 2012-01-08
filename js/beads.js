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

var ColorPallet = new Array();

var gridCols = 6;
var gridRows = 24;
var beadHeight = 10;
var beadWidth = 16;

var ColorSquares = new Array();

var braceletZoom = -30;

var CurrentColor = "#000000";

var startBead = 0;
var stopBead = 143;
var settingStart = false;
var settingStop = false;
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
ColorBead.prototype.draw = function(doFill, important){
	ctxBeads.fillStyle = this.color;	
	var tempX, tempY;
	//middle grid
	tempX = padding + 2*gridCols*beadWidth + beadWidth/2 - this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = beadHeight*1.5 + this.row*(beadHeight);
  
  //for now
  var middleBeadButton = document.createElement('button');
  middleBeadButton.style.position = "absolute";
  middleBeadButton.style.top = tempY + "px";
  middleBeadButton.style.left = tempX + "px";
  middleBeadButton.style.background = this.color;
  document.body.appendChild(middleBeadButton);
  
	//left grid
	tempX = padding + gridCols*beadWidth - this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = (beadHeight/2) + this.row*(beadHeight);
	var leftBeadButton = document.createElement('button');
  leftBeadButton.style.position = "absolute";
  leftBeadButton.style.top = tempY + "px";
  leftBeadButton.style.left = tempX + "px";
  leftBeadButton.style.background = this.color;
  document.body.appendChild(leftBeadButton);
	//right grid
	tempX = padding + 3*gridCols*beadWidth + beadWidth - this.column*(beadWidth) + this.row*(beadWidth/2);
	tempY = 2.5*beadHeight + this.row*(beadHeight);
	var rightBeadButton = document.createElement('button');
  rightBeadButton.style.position = "absolute";
  rightBeadButton.style.top = tempY + "px";
  rightBeadButton.style.left = tempX + "px";
  rightBeadButton.style.background = this.color;
  document.body.appendChild(rightBeadButton);
}
function createGrid(){
	ColorBeads = new Array(gridRows*gridCols);
	var i = 0;
	for(var k = 0; k < gridRows; k++){
		for(var l = 0; l < gridCols; l++){
			ColorBeads[i] = new ColorBead(k, l, "#ffffff");
			ColorBeads[i].draw(false, i==startBead || i==stopBead);
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
  
  var numRow = document.getElementById("numRow");
  var numCol = document.getElementById("numCol");
  numCol.innerHTML = "" + gridCols + " across";
  numRow.innerHTML = "" + gridRows + " down";
  
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
	document.getElementById("saveLoad").appendChild(braceletList);
	var loadButton = document.createElement('button');
	loadButton.innerHTML = "Load";
	loadButton.addEventListener('click', loadBracelet, false);
	document.getElementById("saveLoad").appendChild(loadButton);
	
	if(getQuerystring("bracelet", "noQuery") != "noQuery"){
	  braceletFromURL();
	}
	
	drawBracelet(braceletZoom);
}

function updateBeads(){
  canvasBeads.width = 3*(gridCols*beadWidth) + 0.5*beadWidth*gridRows + beadWidth;
	canvasBeads.height = beadHeight*(gridRows+3);
  var numRow = document.getElementById("numRow");
  var numCol = document.getElementById("numCol");
  numCol.innerHTML = "" + gridCols + " across";
  numRow.innerHTML = "" + gridRows + " down";
  ctxBeads.clearRect(0,0,canvasBeads.width,canvasBeads.height);
  for(var i = 0; i < ColorBeads.length; i++){
    ColorBeads[i].draw(ColorBeads[i].drawn, i==startBead || i==stopBead)
  }
  drawBracelet(braceletZoom);
}

function addCol(){
  var temp = ColorBeads.length;
  gridCols++;
  for(var i = 0; i < gridRows; i++){
    ColorBeads.push(new ColorBead(i,gridCols-1,"#ffffff"));
  }
  if(startBead == 0 && stopBead == temp-1){
    stopBead = ColorBeads.length-1;
  }
  braceletZoom -= 0.3;
  updateBeads();
}

function addRow(){
  var temp = ColorBeads.length;
  gridRows++;
  for(var i = 0; i < gridCols; i++){
    ColorBeads.push(new ColorBead(gridRows-1,i,"#ffffff"));
  }
  if(startBead == 0 && stopBead == temp-1){
    stopBead = ColorBeads.length-1;
  }
  braceletZoom -= 0.9;
  updateBeads();
}

function minusRow(){
  var temp = ColorBeads.length;
  gridRows--;
  var tempBeads = ColorBeads;
  createGrid();
  for(var i = 0; i < tempBeads.length; i++){
    for(var k = 0; k < ColorBeads.length; k++){
      if(tempBeads[i].column == ColorBeads[k].column && tempBeads[i].row == ColorBeads[k].row){
        ColorBeads[k].color = tempBeads[i].color;
        ColorBeads[k].drawn = tempBeads[i].drawn;
      }
    }
  }
  if(startBead == 0 && stopBead == temp-1){
    stopBead = ColorBeads.length-1;
  }
  braceletZoom += 0.9;
  updateBeads();
}

function minusCol(){
  var temp = ColorBeads.length;
  gridCols--;
  var tempBeads = ColorBeads;
  createGrid();
  for(var i = 0; i < tempBeads.length; i++){
    for(var k = 0; k < ColorBeads.length; k++){
      if(tempBeads[i].column == ColorBeads[k].column && tempBeads[i].row == ColorBeads[k].row){
        ColorBeads[k].color = tempBeads[i].color;
        ColorBeads[k].drawn = tempBeads[i].drawn;
      }
    }
  }
  if(startBead == 0 && stopBead == temp-1){
    stopBead = ColorBeads.length-1;
  }
  braceletZoom += 0.3;
  updateBeads();
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
  ColorPallet.push(color);
}

function updateColors(color){
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
  var cols = [];
  var rows = [];
  var zooms = [];
  var stopBeads = [];
  var startBeads = [];
  var colors = [];
  if(window.localStorage.getItem('bracelets')){
    bracelets = window.localStorage.getItem('bracelets');
    bracelets = bracelets.split(";");
    names = window.localStorage.getItem('names');
    names = names.split(";");
    cols = window.localStorage.getItem('columns');
    cols = cols.split(";");
    rows = window.localStorage.getItem('rows');
    rows = rows.split(";");
    zooms = window.localStorage.getItem('zooms');
    zooms = zooms.split(";");
    startBeads = window.localStorage.getItem('startBeads');
    startBeads = startBeads.split(";");
    stopBeads = window.localStorage.getItem('stopBeads');
    stopBeads = stopBeads.split(";");
    colors = window.localStorage.getItem('colors');
    colors = colors.split(";");
  }
  var tempBeads = [ ];
  for(var i = 0; i < ColorBeads.length; i++){
    tempBeads.push(""+ColorBeads[i].row + "," + ColorBeads[i].column + "," + ColorBeads[i].color + "," + ColorBeads[i].drawn);
  }
  tempBeads = tempBeads.join(".");
  bracelets.push(tempBeads);
  names.push(document.querySelector('#saveas').value);
  cols.push(gridCols);
  rows.push(gridRows);
  zooms.push(braceletZoom);
  startBeads.push(startBead);
  stopBeads.push(stopBead);
  colors.push(ColorPallet.join(','));
  try {
	 window.localStorage.setItem('bracelets', bracelets.join(";"));
	 window.localStorage.setItem('names', names.join(";"));
	 window.localStorage.setItem('columns', cols.join(";"));
	 window.localStorage.setItem('rows', rows.join(";"));
	 window.localStorage.setItem('zooms', zooms.join(";"));
	 window.localStorage.setItem('startBeads', startBeads.join(";"));
	 window.localStorage.setItem('stopBeads', stopBeads.join(";"));
	 window.localStorage.setItem('colors', colors.join(";"));
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
  var cols = window.localStorage.getItem('columns');
  cols = cols.split(";");
  var rows = window.localStorage.getItem('rows');
  rows = rows.split(";");
  bracelets = bracelets.split(";");
  var zooms = window.localStorage.getItem('zooms');
  zooms = zooms.split(";");
  var startBeads = window.localStorage.getItem('startBeads');
  startBeads = startBeads.split(";");
  var stopBeads = window.localStorage.getItem('stopBeads');
  stopBeads = stopBeads.split(";");
  var colors = window.localStorage.getItem('colors');
  colors = colors.split(";");
  ColorPallet = colors[document.querySelector('#bracelet_list').selectedIndex].split(',');
  ColorBeads = bracelets[document.querySelector('#bracelet_list').selectedIndex];
  gridCols = parseInt(cols[document.querySelector('#bracelet_list').selectedIndex]);
  gridRows = parseInt(rows[document.querySelector('#bracelet_list').selectedIndex]);
  braceletZoom = parseInt(zooms[document.querySelector('#bracelet_list').selectedIndex]);
  startBead = parseInt(startBeads[document.querySelector('#bracelet_list').selectedIndex]);
  stopBead = parseInt(stopBeads[document.querySelector('#bracelet_list').selectedIndex]);
  ColorBeads = ColorBeads.split(".");
  canvasBeads.width = 3*(gridCols*beadWidth) + 0.5*beadWidth*gridRows + beadWidth;
	canvasBeads.height = beadHeight*(gridRows+3);
  ctxBeads.clearRect(0,0,canvasBeads.width,canvasBeads.height);
  //document.getElementById("colors").removeChildren however this works
  for(var i = 0; i < ColorPallet.length; i++){
    updateColors(ColorPallet[i]);
  }
  for(var i = 0; i < ColorBeads.length; i++){
    var attributes = ColorBeads[i].split(",");
    ColorBeads[i] = new ColorBead(attributes[0], attributes[1], attributes[2]);
    ColorBeads[i].drawn = attributes[3] == "true";
    ColorBeads[i].draw(ColorBeads[i].drawn, i==startBead || i==stopBead);
  }
  updateBeads();
}

function onMouseClickBead(event){
  getMouseXY(event);
  var beadsPos = findPos(canvasBeads);
  tempX -= beadsPos[0];
  tempY -= beadsPos[1];
	for(var i = 0; i < ColorBeads.length; i++){
		var beadLeft = padding - ColorBeads[i].column*(beadWidth) + ColorBeads[i].row*(beadWidth/2) - (beadWidth);
		var beadRight = beadLeft + (beadWidth);
		var beadTop = ColorBeads[i].row*beadHeight;
		var beadBottom = beadHeight/2 + ColorBeads[i].row*beadHeight + beadHeight/2;
		var isLeft = tempX > (beadLeft+2*(gridCols*beadWidth + beadWidth/2)) && tempX < (beadRight+2*(gridCols*beadWidth + beadWidth/2)) && tempY < (beadBottom+beadHeight) && tempY > (beadTop+beadHeight);
		var isMiddle = tempX > (beadLeft+(gridCols*beadWidth + beadWidth/2)) && tempX < (beadRight+(gridCols*beadWidth + beadWidth/2)) && tempY < (beadBottom) && tempY > (beadTop);
		var isRight = tempX > (beadLeft+3*(gridCols*beadWidth + beadWidth/2)) && tempX < (beadRight+3*(gridCols*beadWidth + beadWidth/2)) && tempY < (beadBottom+2*beadHeight) && tempY > (beadTop+2*beadHeight);
		if(isLeft || isMiddle || isRight){
		  if(settingStart){
		    startBead = i;
		    if(startBead > stopBead){
		      var temp = startBead;
		      startBead = stopBead;
		      stopBead = temp;
		    }
		    settingStart = false;
		  }
		  else if(settingStop){
		    stopBead = i
		    if(startBead > stopBead){
		      var temp = startBead;
		      startBead = stopBead;
		      stopBead = temp;
		    }
		    settingStop = false;
		  }
		  else{
			  ColorBeads[i].color = "#ffffff";
			  ColorBeads[i].draw(true,false);
			  if(!event.shiftKey){
			    ColorBeads[i].color = CurrentColor;
			  }
			  ColorBeads[i].drawn = !event.shiftKey;
			  ColorBeads[i].draw(!event.shiftKey, i==startBead || i==stopBead);
			}
			break;
		}
	}
  updateBeads();
}

function setStart(){
  if(settingStop){
    settingStop = false;
  }
  settingStart = true;
}

function setStop(){
  if(settingStart){
    settingStart = false;
  }
  settingStop = true;
}

function braceletFromURL(){
  var bracelet = getQuerystring('bracelet');
  var cols = getQuerystring('columns');
  var rows = getQuerystring('rows');
  var zoom = getQuerystring('zoom');
  var start = getQuerystring('start');
  var stop = getQuerystring('stop');
  ColorPallet = getQuerystring('colors').split(",");
  ColorBeads = bracelet;
  gridCols = parseInt(cols);
  gridRows = parseInt(rows);
  braceletZoom = parseInt(zoom);
  startBead = parseInt(start);
  stopBead = parseInt(stop);
  ColorBeads = ColorBeads.split(".");
  canvasBeads.width = 3*(gridCols*beadWidth) + 0.5*beadWidth*gridRows + beadWidth;
	canvasBeads.height = beadHeight*(gridRows+3);
  ctxBeads.clearRect(0,0,canvasBeads.width,canvasBeads.height);
  for(var i = 0; i < ColorBeads.length; i++){
    var attributes = ColorBeads[i].split(",");
    ColorBeads[i] = new ColorBead(attributes[0], attributes[1], attributes[2]);
    ColorBeads[i].drawn = attributes[3] == "true";
    ColorBeads[i].draw(ColorBeads[i].drawn);
  }
  updateBeads();
  //document.getElementById("colors").removeChildren however this works
  for(var k = 0; k < ColorPallet.length; k++){
    updateColors(ColorPallet[k]);
  }
}

function braceletToURL(){
  var bracelet = [];
  for(var i = 0; i < ColorBeads.length; i++){
    bracelet.push(""+ColorBeads[i].row + "," + ColorBeads[i].column + "," + ColorBeads[i].color + "," + ColorBeads[i].drawn);
  }
  var colors = ColorPallet.join(',');
  bracelet = bracelet.join(".");
  window.location.href = "file:///home/whytheplatypus/Dropbox/Misc/beads/index.html?bracelet="+bracelet+"&columns="+gridCols+"&rows="+gridRows+"&zoom="+braceletZoom+"&start="+startBead+"&stop="+stopBead+"&colors="+colors;
}
/*function aKeyDown(e) {
	e=window.event;
	if (e.keyCode==91) {commandIsDown=true;}
}

function aKeyUp(e) {
	e=window.event;
	if (e.keyCode==91) {commandIsDown=false;}
}*/
