// (c) Dean McNamee <dean@gmail.com>.  All rights reserved.

function drawBracelet(zoom) {
  var black = new Pre3d.RGBA(0, 0, 0, 1);
  var white = new Pre3d.RGBA(1, 1, 1, 1);

  var screen_canvas = document.getElementById('cv3d');
  var renderer = new Pre3d.Renderer(screen_canvas);

  var cubes = [ ];

  var kKappa = 0.66666666666;  // Circle via 2 cubic splines.

  var points = [ ];

  var dSphere = 1;
  var nAround = gridCols;
  var nDeep = gridRows;
  
  var threeDBeads = new Array(ColorBeads.length);
  for(var i = 0; i < threeDBeads.length; i++){
    threeDBeads[i] = ColorBeads[(startBead)+(i%((stopBead+1)-startBead))];
  }
  
  var rSpiral = (nAround*dSphere+(dSphere/2))/(2*Math.PI);
  for (var t = 0; t < Math.ceil(nAround*nDeep); t++) {
    points.push({x: Math.cos(t/rSpiral)*rSpiral, y: Math.sin(t/rSpiral)*rSpiral,  z: t*((dSphere)/(nAround+1))});
  }
  var theta = Math.PI/2;
  for(var i = 0; i < points.length; i++){
    var cube = Pre3d.ShapeUtils.makeSphere(dSphere/2,10, 10);
    var transform = new Pre3d.Transform();
    transform.translate(points[i].x, points[i].y*Math.cos(theta)-points[i].z*Math.sin(theta)+(0.83*nDeep/2), points[i].z*Math.cos(theta)+points[i].y*Math.sin(theta));
    cubes.push({
      shape: cube,
      color: new Pre3d.RGBA(HexToR(threeDBeads[i].color)/255,HexToG(threeDBeads[i].color)/255,HexToB(threeDBeads[i].color)/255,1),
      trans: transform});
  }


  var num_cubes = cubes.length;
  var cur_white = false;  // Default to black background.

  function draw() {
    for (var i = 0; i < num_cubes; ++i) {
      var cube = cubes[i];
      renderer.fill_rgba = cube.color;
      renderer.transform = cube.trans;
      renderer.bufferShape(cube.shape);
    }

    renderer.ctx.setFillColor(1, 1, 1, 1);
    renderer.drawBackground();

    renderer.drawBuffer();
    renderer.emptyBuffer();
  }

  renderer.camera.focal_length = 2.5;
  // Have the engine handle mouse / camera movement for us.
  DemoUtils.autoCamera(renderer, 0, 0, zoom, 0.00, -1.06, 0, draw);

  
  draw();
}
