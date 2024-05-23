// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let seed = 239;

const treeColor = "#1f222b";
const skyColor = "#a4f4f1";
const mountainColor = "#027771";
const sunColor = ["#e3452c", "#f86a46", "#fd8b66", "#ffb88d"];
const waterColor = "#065363";
const petalColor = ["#f293bb", "#ffeff5", "#e7a2b5"];

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

// function resizeScreen() {
//   centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
//   centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
//   console.log("Resizing...");
//   resizeCanvas(canvasContainer.width(), canvasContainer.height());
//   // redrawCanvas(); // Redraw everything based on new size
// }

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas = createCanvas(540, 720);
  canvas.parent("canvas-container");

  $("#clicker").click(generate);
}

function generate() {
  seed += 1;
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);

  /* Burning a random because the first random is not actually emulating random behavior 
  (p5 feature based on research) */
  random();
  background(100);
  noStroke();

  // set vars for draw function inputs
  let waterLevel = (3 * height) / 5;
  let mountainHeight = height / 3 + (random() * height) / 50;

  //calls functions for drawing each individual piece of the picture
  fill(skyColor);
  rect(0, 0, width, height);

  drawSun();

  fill(waterColor);
  rect(0, waterLevel, width, height - waterLevel);

  drawMountain(waterLevel, mountainHeight);
  drawTree();
}

function drawSun() {
  //mapping Hexcode colors to color() object
  let colors = sunColor.map((c) => color(c));

  //setting inputs for circle()
  let x =
    ((random(0.2, 0.8) + random(0.2, 0.8) + random(0.2, 0.8)) / 3) * width;
  let y = height / 4;
  let d = (2 * width) / 5;
  let size = 1;
  let offsetX = 0;
  let offsetY = 0;

  // drawing the sun
  for (hue in sunColor) {
    let currentColor = colors[hue];
    if (size < 1) {
      currentColor.setAlpha(120 * size);
      offsetX =
        ((random(-1, 1) *
          (random(width / 30) + random(width / 30) + random(width / 30))) /
          3) *
        size;
      offsetY =
        ((random(-1, 1) *
          (random(width / 30) + random(width / 30) + random(width / 30))) /
          3) *
        size;
    }
    fill(currentColor);
    circle(x + offsetX, y + offsetY, d * size);
    size *= 0.67;
  }
}

function drawMountain(base, peak) {
  fill(mountainColor);

  //setting control points for the bezier curve based on input
  let x1 =
    (random(width / 4, (2 * width) / 3) +
      random(width / 4, (2 * width) / 3) +
      random(width / 4, (2 * width) / 3)) /
    3;
  let x2 = x1 + 0.1 * width;
  let y1 = base - (base - peak) / 4;
  let y2 = peak + (base - peak) / 3;

  // drawing the bezier curve for the mountain
  beginShape();
  vertex(0, base);
  bezierVertex(x1 / 2, y1, 0.9 * x1, y2, x1, peak);
  vertex(x2, peak);
  bezierVertex(x2 + 0.1 * x1, y2, x2 + (width - x2) / 3, y1, width, base);
  endShape(CLOSE);
}

function drawBranch(x1, y1, x2, y2, angle, length) {
  fill(treeColor);
  //Check if branch is too thin
  let size = dist(x1, y1, x2, y2);

  // Draw petals if no more branches are to be drawn
  if (length < width / 15 || size < width / 100) {
    drawPetals(x1, y1, x2, y2);
    return;
  }

  // Calculate the end point of the branch
  let midX = (x1 + x2) / 2 + cos(angle) * length;
  let midY = (y1 + y2) / 2 + sin(angle) * length;

  let x3 = (midX + x1) / 2;
  let y3 = (midY + y1) / 2;
  let x4 = (midX + x2) / 2;
  let y4 = (midY + y2) / 2;

  quad(x1, y1, x2, y2, x4, y4, x3, y3);

  // Recursively draw smaller branches with slight angle variations
  let branches = round((length - 30) / 50);
  for (let i = 0; i < random(1, branches); i++) {
    drawBranch(
      x3,
      y3,
      x4,
      y4,
      angle + (random(-0.7, 0.7) * PI) / 3,
      length * random(0.6, 0.7)
    );
  }
}

function drawPetals(x1, y1, x2, y2) {
  // Grabbing a color from potential Petal Colors
  let colors = petalColor.map((c) => color(c));

  // setting center position of petal cluster
  let x = (x1 + x2) / 2;
  let y = (y1 + y2) / 2;

  // sets a random amount of petals to be drawn
  let petals = random(0, 30);

  //draws each petal
  for (let i = 0; i < petals; i++) {
    let curColor = random(colors);
    curColor.setAlpha(random(128, 180));
    fill(curColor);
    let offsetX =
      (random(-1, 1) *
        (random(width / 20) + random(width / 20) + random(width / 20))) /
      3;
    let offsetY =
      (random(-1, 1) *
        (random(width / 20) + random(width / 20) + random(width / 20))) /
      3;
    let w = random(width / 20, width / 40);
    let h = random(width / 20, width / 40);
    let angle = (random() * sin((2 * PI * millis()) / 1500.0)) / 2;

    // Creates rotations for each petal
    push(); // Save the current canvas transformation
    translate(x + offsetX, y + offsetY); // Move the canvas origin to petal position
    rotate(angle); // Rotate the canvas by the angle
    ellipse(0, 0, w, h); // Draw the petal
    pop(); // Restore the original canvas transformation
  }
}

function drawTree() {
  const scrub = (mouseX / width) * 10;
  fill(treeColor);

  // Sets the trunk width
  let trunkWidth = ((random() + random() + random()) / 3) * 20 + 50;
  beginShape();

  // Bottom Right point for the base of the tree trunk
  // Acts as the start point for the first bezier curve
  let p1 = {
    x:
      (random(width / 3, (3 * width) / 5) +
        random(width / 3, (3 * width) / 5) +
        random(width / 3, (3 * width) / 5)) /
        3 +
      scrub,
    y: height,
  };

  // Top point where the tree trunk connects to the left side of the canvas
  // Acts as the end point for the first bezier curve
  let p2 = {
    x: -width / 10 + scrub,
    y:
      (random((2 * height) / 5, (4 * height) / 7) +
        random((2 * height) / 5, (4 * height) / 7) +
        random((2 * height) / 5, (4 * height) / 7)) /
      3,
  };

  vertex(p1.x, p1.y); // Setting p1 as the first point for the bezier curve
  bezierVertex(
    width / 2 + scrub,
    height / 1.2,
    width / 2 + scrub,
    height / 1.3,
    p2.x,
    p2.y
  );

  // Setting the second point that connects to the left side of the canvas
  // Also acts as the start point for the second bezier curve
  vertex(-width / 10 + scrub, p2.y + trunkWidth);
  bezierVertex(
    width / 2 - trunkWidth + scrub,
    height / 1.3 + 30,
    width / 1.9 - trunkWidth + scrub,
    height / 1.2 + 30,
    p1.x - trunkWidth,
    height
  );
  endShape(CLOSE);

  // Finding random points along the trunk to add branches
  // draws a single branch on the right side of the trunk
  let size = 0.04;
  let angle = -QUARTER_PI + random(-0.5, 0.5) * QUARTER_PI;
  let length = random(width / 10, height / 10);
  let pos1 = (random() + random() + random()) / 3;
  let pos2 = pos1 + size;
  let x1 = bezierPoint(p1.x, width / 2 + scrub, width / 2 + scrub, p2.x, pos1);
  let y1 = bezierPoint(p1.y, height / 1.2, height / 1.3, p2.y, pos1);
  let x2 = bezierPoint(p1.x, width / 2 + scrub, width / 2 + scrub, p2.x, pos2);
  let y2 = bezierPoint(p1.y, height / 1.2, height / 1.3, p2.y, pos2);

  drawBranch(x1, y1, x2, y2, angle, length);

  // draws a single branch on the left side of the trunk
  angle = PI / 1.5 + random(0, 0.5) * QUARTER_PI;
  length = random(width / 10, height / 10);
  pos1 = (random() + random() + random()) / 3;
  pos2 = pos1 + size;
  x1 = bezierPoint(
    -width / 10 + scrub,
    width / 2 - trunkWidth + scrub,
    width / 1.9 - trunkWidth + scrub,
    p1.x - trunkWidth,
    pos1
  );
  y1 = bezierPoint(
    p2.y + trunkWidth,
    height / 1.3 + 30,
    height / 1.2 + 30,
    height,
    pos1
  );
  x2 = bezierPoint(
    -width / 10 + scrub,
    width / 2 - trunkWidth + scrub,
    width / 1.9 - trunkWidth + scrub,
    p1.x - trunkWidth,
    pos2
  );
  y2 = bezierPoint(
    p2.y + trunkWidth,
    height / 1.3 + 30,
    height / 1.2 + 30,
    height,
    pos2
  );

  drawBranch(x1, y1, x2, y2, angle, length);

  //sets a random number of branches to be drawn
  let branches = random(3, 5);
  let step = 0;

  //draws the branches set by the var: branches
  for (let i = 0; i < branches; i++) {
    step += height / 12;
    angle =
      (((random(-1, 1) * QUARTER_PI) / 2) *
        sin((2 * PI * millis()) / 30000.0)) /
      2;
    x1 = -width / 10 + scrub;
    y1 = random(0 + step, height / 16 + step);
    x2 = -width / 10 + scrub;
    y2 = y1 + random(height / 50, height / 30);
    length = random(width / 3, width / 1.5);
    drawBranch(x1, y1, x2, y2, angle, length);
  }
}
