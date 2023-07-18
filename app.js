// Get canvas element and engine
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

// Create scene
var scene = new BABYLON.Scene(engine);

// Define variables
var width = 1;
var height = 1.5;
var depth = 0.1;
var flabellum = 0;
var flabellumSpace = 0;
var flabellumSize = 0;

var color = new BABYLON.Color4(1, 1, 1, 1);

const light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(1, 1, 0)
);

// Get input and slider elements
var widthInput = document.getElementById("width-input");
var widthSlider = document.getElementById("width-slider");
var heightInput = document.getElementById("height-input");
var heightSlider = document.getElementById("height-slider");
var depthInput = document.getElementById("depth-input");
var depthSlider = document.getElementById("depth-slider");
var flabellumInput = document.getElementById("flabellum-input");
var flabellumSlider = document.getElementById("flabellum-slider");
// var flabellumSpaceInput = document.getElementById("flabellum-space-input");
// var flabellumSpaceSlider = document.getElementById("flabellum-space-slider");
// var flabellumSizeInput = document.getElementById("flabellum-size-input");
// var flabellumSizeSlider = document.getElementById("flabellum-size-slider");

// Create window frame mesh
var createWindowFrame = function () {
  // Create edge meshes
  var top = BABYLON.MeshBuilder.CreateBox(
    "top",
    { width: width, height: depth, depth: depth },
    scene
  );
  top.position.x = 0;
  top.position.y = height / 2 - depth / 2;
  top.position.z = depth / 2;
  top.material = new BABYLON.StandardMaterial("topMat", scene);
  top.material.diffuseColor = color;

  var bottom = BABYLON.MeshBuilder.CreateBox(
    "bottom",
    { width: width, height: depth, depth: depth },
    scene
  );
  bottom.position.x = 0;
  bottom.position.y = -height / 2 + depth / 2;
  bottom.position.z = depth / 2;
  bottom.material = new BABYLON.StandardMaterial("bottomMat", scene);
  bottom.material.diffuseColor = color;

  var left = BABYLON.MeshBuilder.CreateBox(
    "left",
    { width: depth, height: height, depth: depth },
    scene
  );
  left.position.x = -width / 2 + depth / 2;
  left.position.y = 0;
  left.position.z = depth / 2;
  left.material = new BABYLON.StandardMaterial("leftMat", scene);
  left.material.diffuseColor = color;

  var right = BABYLON.MeshBuilder.CreateBox(
    "right",
    { width: depth, height: height, depth: depth },
    scene
  );
  right.position.x = width / 2 - depth / 2;
  right.position.y = 0;
  right.position.z = depth / 2;
  right.material = new BABYLON.StandardMaterial("rightMat", scene);
  right.material.diffuseColor = color;

  // Combine meshes into single mesh
  var windowFrame = BABYLON.Mesh.MergeMeshes(
    [top, bottom, left, right],
    true,
    true,
    undefined,
    false,
    true
  );
  return windowFrame;
};

// Create camera
var camera = new BABYLON.ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 2,
  5,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

//line
var createLines = () => {
  var pointsX = [
    new BABYLON.Vector3(-width / 2, (-height / 2) * 1.1, 0),
    new BABYLON.Vector3(width / 2, (-height / 2) * 1.1, 0),
  ];
  var pointsY = [
    new BABYLON.Vector3((-width / 2) * 1.1, -height / 2, depth),
    new BABYLON.Vector3((-width / 2) * 1.1, height / 2, depth),
  ];
  var pointsZ = [
    new BABYLON.Vector3((-width / 2) * 1.1, -height / 2, 0),
    new BABYLON.Vector3((-width / 2) * 1.1, -height / 2, depth),
  ];

  var linesX = BABYLON.MeshBuilder.CreateLines(
    "lines",
    { points: pointsX },
    scene
  );
  var linesY = BABYLON.MeshBuilder.CreateLines(
    "lines",
    { points: pointsY },
    scene
  );
  var linesZ = BABYLON.MeshBuilder.CreateLines(
    "lines",
    { points: pointsZ },
    scene
  );
};

let fanCount = 0;

const createFlabellum = (count) => {
  let fanMaterial = new BABYLON.StandardMaterial("fanMaterial", scene);
  let fanHeight = (height - depth * 2) / count / 1.1;
  let fanY = height / 2 - depth - fanHeight / 2 - depth / 5;
  // clone 元件
  var fan0 = BABYLON.MeshBuilder.CreateBox("fan0", {
    height: fanHeight,
    width: width - depth * 2,
    depth: depth / 5,
  });
  fan0.position.x = 0;
  fan0.position.y = fanY - 0;
  fan0.position.z = depth / 2;
  fan0.setPivotPoint(new BABYLON.Vector3(0, fanHeight / 2, 0));
  fan0.rotation.x = Math.PI / 10;
  fan0.material = fanMaterial;

  const mount = count;
  const places = [];
  for (var i = 1; i <= mount; i++) {
    places.push([fanY - fanHeight * (i - 1) * 1.08, 0]);
  }
  // 扇葉;
  var fan = [];

  for (let i = 1; i < places.length; i++) {
    fan[i] = fan0.createInstance("fan" + i);
    fan[i].position.x = 0;
    fan[i].position.y = places[i][0];
    fan[i].position.z = depth / 2;
    fan[i].rotation.x = Math.PI / 10;
    fan[i].material = fanMaterial;
  }
  fanCount = count;
};
createFlabellum(flabellumInput.value);

var updateFlabellum = (count) => {
  scene.meshes.forEach((e) => {
    e.id.includes("fan") ? e.dispose() : null;
  });

  createFlabellum(count);

  fanCount = count;
};

// Create window frame mesh
var windowFrame = createWindowFrame();
var lines = createLines();

// Update window frame dimensions based on user input
var updateWindowFrame = function () {
  width = parseFloat(widthInput.value);
  height = parseFloat(heightInput.value);
  depth = parseFloat(depthInput.value);

  windowFrame.dispose();
  windowFrame = createWindowFrame();
};
//update line
var updateLines = () => {
  scene.meshes.forEach((e) => {
    e.id.includes("lines") ? e.dispose() : null;
  });

  lines = createLines();
};

// Bind input and slider elements to updateWindowFrame function
widthInput.addEventListener("input", updateWindowFrame);
widthSlider.addEventListener("input", function () {
  widthInput.value = widthSlider.value;
  updateWindowFrame();
  updateLines();
  updateFlabellum(flabellumInput.value);
});

heightInput.addEventListener("input", updateWindowFrame);
heightSlider.addEventListener("input", function () {
  heightInput.value = heightSlider.value;
  updateWindowFrame();
  updateLines();
  updateFlabellum(flabellumInput.value);
});

depthInput.addEventListener("input", updateWindowFrame);
depthSlider.addEventListener("input", function () {
  depthInput.value = depthSlider.value;
  updateWindowFrame();
  updateLines();
  updateFlabellum(flabellumInput.value);
});

flabellumInput.addEventListener("input", () => {
  updateWindowFrame();
  updateFlabellum(flabellumInput.value);
});
flabellumSlider.addEventListener("input", function () {
  flabellumInput.value = flabellumSlider.value;
  updateWindowFrame();
  updateLines();
  updateFlabellum(flabellumInput.value);
});

// flabellumSpaceInput.addEventListener("input", updateWindowFrame);
// flabellumSpaceSlider.addEventListener("input", function () {
//   flabellumSpaceInput.value = flabellumSpaceSlider.value;
//   updateWindowFrame();
// });

// flabellumSizeInput.addEventListener("input", updateWindowFrame);
// flabellumSizeSlider.addEventListener("input", function () {
//   flabellumSizeInput.value = flabellumSizeSlider.value;
//   updateWindowFrame();
// });

// Render loop
engine.runRenderLoop(function () {
  scene.render();
});

// Resize window
window.addEventListener("resize", function () {
  engine.resize();
});
