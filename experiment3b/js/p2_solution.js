/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  // initialize grid with background text codes
  let grid = [];
  generateBackground(grid, numRows, numCols);

  // generates random lake position, size and the surrounding beach
  generateLake(
    grid,
    floor(random(numRows)),
    floor(random(numCols)),
    floor(random(numRows / 7, numRows / 5)),
    floor(random(2, 7))
  );

  // generates patches of trees
  generateTrees(
    grid,
    3,
    floor(random(numRows / 7, numRows / 5)),
    numRows,
    numCols
  );

  return grid;
}

function generateBackground(grid, numRows, numCols) {
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
}

// generates tree groves with amount 'groves'
function generateTrees(grid, groves, radius, numRows, numCols) {
  for (let a = 0; a < groves; a++) {
    let x = floor(random(0, numCols));
    let y = floor(random(0, numRows));
    let width = floor(random(radius, radius * 2));
    let height = floor(random(radius, radius * 2));

    // makes groves in the shape of an ellipse
    generateEllipse(grid, x, y, width, height, "_", "t");
  }
}

function generateLake(grid, i, j, radius, centerPoints) {
  // points stores the tiles that are within the ellipse radius centered at i, j
  let points = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[i].length; x++) {
      let dx = x - i;
      let dy = y - j;
      if (dx * dx + dy * dy <= radius * radius) {
        points.push({ x: x, y: y });
      }
    }
  }

  // pondPositions stores 'centerPoints' which are mid points of the ellipses that generate the lake
  let pondPositions = [];
  for (let a = 0; a < centerPoints && points.length > 0; a++) {
    let index = floor(random(points.length));
    pondPositions.push(points[index]);
    //points.splice(index, 1); // Remove the selected point to avoid duplicates
  }

  // creates an ellipse and beach around it for each pondPosition, creating the lake
  for (let a = 0; a < pondPositions.length; a++) {
    let pos = pondPositions[a];
    let width = floor(random(radius * 1.5, radius * 3));
    let height = floor(random(radius * 1.5, radius * 3));
    generateEllipse(grid, pos.x, pos.y, width, height, ["_", "b"], "w");
    width = width + random(2, 5);
    height = height + random(2, 5);
    generateEllipse(grid, pos.x, pos.y, width, height, ["_"], "b");
  }
}

// helper function for creating an ellipse of textcode while replacing target
function generateEllipse(grid, i, j, width, height, target, textcode) {
  let w = width / 2;
  let h = height / 2;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[i].length; y++) {
      let dx = x - i;
      let dy = y - j;
      if (
        (dx * dx) / (h * h) + (dy * dy) / (w * w) < 1 &&
        gridCheck(grid, x, y, target)
      ) {
        grid[x][y] = textcode;
      }
    }
  }
}

function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // background and terrain logic
      if (gridCheck(grid, i, j, ["_", "t"])) {
        if (random() < 0.08) {
          placeTile(i, j, floor(random(1, 4)), 0);
        } else {
          placeTile(i, j, 0, 0);
        }
        if (gridCheck(grid, i, j, ["_", "t"])) {
          if (random() < 0.005) {
            placeTile(i, j, 26, floor(random(0, 4)));
          }
        }
      }

      // tree logic
      if (gridCheck(grid, i, j, "t")) {
        let exceptions = [0, 1, 2, 4, 6, 8, 9];
        if (exceptions.includes(gridCode(grid, i, j, "t"))) {
          placeTile(i, j, 14, 6);
        } else {
          drawContext(grid, i, j, ["t"], 14, 8);
        }
      }

      // beach logic
      if (gridCheck(grid, i, j, "b")) {
        placeTile(i, j, 0, 18);
        if (random() < 0.1) {
          placeTile(i, j, floor(random(1, 4)), round(random(18, 19)));
        }
        drawContext(grid, i, j, ["w", "b"], 8, 2);
      }

      // water logic
      if (gridCheck(grid, i, j, "w")) {
        placeTile(i, j, 0, 14);
        if (random() < 0.6) {
          placeTile(i, j, ((millis() * 0.0001 * random(0, 3)) | 0) % 3, 14);
        }
        drawContext(grid, i, j, "w", 3, 20);
      }
    }
  }
}
function isValidTile(grid, i, j) {
  if (0 <= i && i < grid.length && 0 <= j && j < grid[i].length) {
    return true;
  }
  return false;
}

/* checks grid[i][j] against target and returns true if tile matches
or if it is not in the grid, returns false otherwise */
function gridCheck(grid, i, j, target) {
  if (0 <= i && i < grid.length && 0 <= j && j < grid[i].length) {
    if (target.includes(grid[i][j])) {
      return true;
    }
  }
  return false;
}

// autotiling logic
function gridCode(grid, i, j, target) {
  let code;
  let tiles = [
    [i - 1, j], // north
    [i, j - 1], // west
    [i, j + 1], // east
    [i + 1, j], // south
  ];
  code = 0;

  // checks each orthogonal directional tile to determine a code
  for (let dir = 0; dir < tiles.length; dir++) {
    let tile = tiles[dir];
    let bit = 0;
    if (!isValidTile(grid, tile[0], tile[1])) {
      bit = 1;
    } else {
      if (gridCheck(grid, tile[0], tile[1], target)) {
        bit = 1;
      }
    }

    // 4-bit binary representing: South, East, West, North
    code += 2 ** dir * bit;
  }
  return code;
}

function drawContext(grid, i, j, target, dti, dtj) {
  if (0 <= i && i < grid.length && 0 <= j && j < grid[i].length) {
    let code = gridCode(grid, i, j, target);
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, dti + tiOffset, dtj + tjOffset);
  }
}

// hard-coded tile offsets for autotiling logic
const lookup = [
  [0, 0],
  [2, 0],
  [3, -1],
  [3, 0],
  [1, -1],
  [1, 0],
  [2, -1],
  [2, 0],
  [2, -2],
  [2, -1],
  [3, -2],
  [3, -1],
  [1, -2],
  [1, -1],
  [2, -2],
  [2, -1],
];
