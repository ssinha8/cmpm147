// project.js - purpose and description here
// Author: Your Name
// Date:

/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
  return [
    {
      name: "Bubble",
      assetUrl: "./img/bubble.jpg",
    },
    {
      name: "Hills",
      assetUrl: "./img/hills.jpg",
    },
    {
      name: "Fire",
      assetUrl: "./img/fire.jpg",
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 2, inspiration.image.height / 2);

  let design = {
    bg: 255,
    fg: [],
  };
  if (inspiration.name == "Bubble") {
    resizeCanvas(inspiration.image.width, inspiration.image.height);
    for (let i = 0; i < 1000; i++) {
      design.fg.push({
        x: random(width / 3, (2 * width) / 3),
        y: random(height / 3, (2 * height) / 3),
        d: random(height / 2),
        fill: random(255),
      });
    }
  } else if (inspiration.name == "Hills") {
    resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
    for (let i = 0; i < 1000; i++) {
      design.fg.push({
        x: random(width),
        y: random((3 * height) / 4),
        w: random(width / 2),
        h: random(height / 2),
        fill: random(255),
      });
    }
  } else if (inspiration.name == "Fire") {
    resizeCanvas(inspiration.image.width / 2, inspiration.image.height / 2);
    for (let i = 0; i < 1000; i++) {
      design.fg.push({
        x1: random(width / 3, (2 * width) / 3),
        y1: random(height),
        x2: random(width / 3, (2 * width) / 3),
        y2: random(height),
        x3: random(width / 3, (2 * width) / 3),
        y3: random(height),
        fill: random(255),
      });
    }
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  if (inspiration.name == "Bubble") {
    for (let shape of design.fg) {
      fill(shape.fill, 128);
      circle(shape.x, shape.y, shape.d);
    }
  } else if (inspiration.name == "Hills") {
    for (let shape of design.fg) {
      fill(shape.fill, 128);
      rect(shape.x, shape.y, shape.w, shape.h);
    }
  } else if (inspiration.name == "Fire") {
    for (let shape of design.fg) {
      fill(shape.fill, 128);
      triangle(shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  if (inspiration.name == "Bubble") {
    for (let shape of design.fg) {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x = mut(shape.x, width / 3, (2 * width) / 3, rate);
      shape.y = mut(shape.y, height / 3, (2 * height) / 3, rate);
      shape.d = mut(shape.d, 0, height / 2, rate);
    }
  } else if (inspiration.name == "Hills") {
    for (let shape of design.fg) {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x = mut(shape.x, 0, width, rate);
      shape.y = mut(shape.y, 0, (3 * height) / 4, rate);
      shape.w = mut(shape.w, 0, width / 2, rate);
      shape.h = mut(shape.h, 0, width / 2, rate);
    }
  } else if (inspiration.name == "Fire") {
    for (let shape of design.fg) {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x1 = mut(shape.x1, width / 3, (2 * width) / 3, rate);
      shape.y1 = mut(shape.y1, 0, height, rate);
      shape.x2 = mut(shape.x2, width / 3, (2 * width) / 3, rate);
      shape.y2 = mut(shape.y2, 0, height, rate);
      shape.x3 = mut(shape.x3, width / 3, (2 * width) / 3, rate);
      shape.y3 = mut(shape.y3, 0, height, rate);
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
