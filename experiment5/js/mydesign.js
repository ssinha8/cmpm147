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
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);

  let design = {
    bg: 128,
    fg: [],
  };

  for (let i = 0; i < 10; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 2),
      h: random(height / 2),
      fill: random(255),
    });
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.fill, 128);
    rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
