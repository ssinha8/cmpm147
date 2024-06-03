/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  // initialize grid with background text codes
  let grid = [];
  generateBackground(grid, numRows, numCols);

  // determine random room count and generate rooms
  let roomct = round((random(2, 7) + random(2, 7) + random(2, 7)) / 3);
  let rooms = generateRooms(grid, numRows, numCols, roomct);

  connectRooms(grid, rooms); //creates hallways between rooms

  // generate terrain outside of the rooms
  //generateTerrain(grid, numRows, numCols, rooms);

  // choose a random room for the waterpit
  let waterpit = floor(random(roomct));
  let room = rooms[waterpit];
  generatePit(grid, room);

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

function generateTerrain(grid, numRows, numCols, rooms) {
  rooms.forEach((room) => {
    let startX = room.x - 2;
    let endX = room.x + room.w + 2;
    let startY = room.y - 2;
    let endY = room.y + room.h + 2;

    // Ensure the boundary is within the grid limits
    for (let x = max(0, startX); x <= min(numRows, endX); x++) {
      for (let y = max(0, startY); y <= min(numCols, endY); y++) {
        // Place secondary wall tiles only if the current tile is an empty space
        if (gridCheck(grid, x, y, ["_"])) {
          grid[x][y] = "-"; // '-' represents the secondary wall tile
        }
      }
    }
  });
}

function generatePit(grid, room) {
  let waterWidth = round((random(0.3, 1) * room.w) / 1.5);
  let waterHeight = round((random(0.3, 1) * room.h) / 1.5);
  let wx1 = floor(random(room.x, room.x + room.w - waterWidth));
  let wy1 = floor(random(room.y, room.y + room.h - waterHeight));
  let wx2 = wx1 + waterWidth;
  let wy2 = wy1 + waterHeight;

  for (let i = wx1; i <= wx2; i++) {
    for (let j = wy1; j <= wy2; j++) {
      grid[i][j] = "w";
    }
  }
}

function generateRooms(grid, numRows, numCols, count) {
  let rooms = []; // stores rooms to create hallways later
  //sets each room on the grid with code: "."
  for (let num = 0; num < count; num++) {
    //setting vars for x, y positions and width and height
    let w = round(
      (random(numRows / 6, numRows / 4) +
        random(numRows / 6, numRows / 4) +
        random(numRows / 6, numRows / 4)) /
        3
    );
    let h = round(
      (random(numCols / 6, numCols / 4) +
        random(numCols / 6, numCols / 4) +
        random(numCols / 6, numCols / 4)) /
        3
    );
    let x1 = floor(
      (random(numRows / 15, (14 * numRows) / 15) +
        random(numRows / 15, (14 * numRows) / 15) +
        random(numRows / 15, (14 * numRows) / 15)) /
        3 -
        w
    );
    let x2 = x1 + w;
    let y1 = floor(
      (random(numCols / 15, (14 * numCols) / 15) +
        random(numCols / 15, (14 * numCols) / 15) +
        random(numCols / 15, (14 * numCols) / 15)) /
        3 -
        h
    );
    let y2 = y1 + h;

    for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        grid[i][j] = ".";
      }
    }

    // pushing the room to my room list
    rooms.push({ x: x1, y: y1, w: w, h: h });
  }
  return rooms;
}

function connectRooms(grid, rooms) {
  for (let i = 0; i < rooms.length - 1; i++) {
    let roomA = rooms[i];
    let roomB = rooms[i + 1];

    // Random points in each room to connect
    let x0 = floor(random() * roomA.w) + roomA.x;
    let y0 = floor(random() * roomA.h) + roomA.y;
    let x1 = floor(random() * roomB.w) + roomB.x;
    let y1 = floor(random() * roomB.h) + roomB.y;

    // function that creates the hallway
    createHallway(grid, x0, y0, x1, y1);
  }

  let hallways = round(random(1, 3)); // hallways that come from the exterior of the grid

  // creates each of the exterior hallways
  for (let i = 0; i < hallways; i++) {
    // Create a hallway from a random side of the grid
    let side = floor(random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let startX, startY, endX, endY;

    switch (side) {
      case 0: // top
        startX = floor(random() * grid[0].length);
        startY = 0;
        break;
      case 1: // right
        startX = grid[0].length - 1;
        startY = floor(random() * grid.length);
        break;
      case 2: // bottom
        startX = floor(random() * grid[0].length);
        startY = grid.length - 1;
        break;
      case 3: // left
        startX = 0;
        startY = floor(random() * grid.length);
        break;
    }

    // Connect this hallway to a random room
    let room = rooms[floor(random() * rooms.length)];
    endX = floor(random() * room.w) + room.x;
    endY = floor(random() * room.h) + room.y;

    createHallway(grid, startX, startY, endX, endY);
  }
}

function createHallway(grid, x0, y0, x1, y1) {
  //draws horizontal segment of hallway
  for (let x = min(x0, x1); x <= max(x0, x1); x++) {
    grid[x][y0] = ".";
    if (y0 + 1 < grid.length) grid[x][y0 + 1] = ".";
  }
  // draws vertical segment of hallway
  for (let y = min(y0, y1); y <= max(y0, y1); y++) {
    grid[x1][y] = ".";
    if (x1 + 1 < grid[0].length) grid[x1 + 1][y] = ".";
  }
}

function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // background and terrain logic
      if (gridCheck(grid, i, j, "_")) {
        if (random() < 0.08) {
          placeTile(i, j, floor(random(1, 4)), 10);
        } else {
          placeTile(i, j, 20, 23);
        }

        // water logic
      } else {
        if (gridCheck(grid, i, j, "w")) {
          placeTile(i, j, ((millis() * 0.0003 * random(0, 3)) | 0) % 3, 14);
          drawContext(grid, i, j, "w", 3, 11);
          drawContext(grid, i, j, ["w", "."], 24, 23);

          // floor logic
        } else {
          if (random() < 0.08) {
            placeTile(i, j, floor(random(11, 15)), 22);
          } else {
            placeTile(i, j, 10, 23);
          }
          drawContext(grid, i, j, [".", "w"], 24, 23);
          if (random() < 0.01) {
            placeTile(i, j, round(random(0, 6)), round(random(28, 30)));
          }
        }
      }
    }
  }
}

/* checks grid[i][j] against target and returns true if tile matches
or if it is not in the grid, returns false otherwise */
function gridCheck(grid, i, j, target) {
  if (0 <= i && i < grid.length && 0 <= j && j < grid[i].length) {
    if (target.includes(grid[i][j])) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// autotiling logic
function gridCode(grid, i, j, target) {
  let code;
  if (0 <= i && i < grid.length && 0 <= j && j < grid[i].length) {
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
      if (gridCheck(grid, tile[0], tile[1], target)) {
        bit = 1;
      }

      // 4-bit binary representing: South, East, West, North
      code += 2 ** dir * bit;
    }
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
  [2, -1],
  [2, -1],
  [3, 0],
  [2, -1],
  [1, 0],
  [2, -1],
  [2, 0],
  [2, -1],
  [2, -1],
  [3, -2],
  [3, -1],
  [1, -2],
  [1, -1],
  [2, -2],
  [2, -1],
];
