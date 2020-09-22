var cellSize = 40;
var columns = 10;
var rows = 10;
var mineChance = 0.1;
var board;
var isWin = false;
var isLost = false;


function create2DArray(rows, columns) {
  var arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      arr[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, mineChance);
    }
  }
  return arr;
}

function setNeighborCounters() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      board[i][j].setNeighbor(countNeighbor(i, j));
    }
  }
}

function countNeighbor(i, j) {
  var neighbor = 0;

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {

      if (x == 0 && y == 0) // Don't count yourselve
        continue;
      if (!isOnBoard(i + x, j + y))
        continue;
      if (board[i + x][j + y].mine)
        neighbor++;
    }
  }
  return neighbor;
}

function isOnBoard(i, j) {
  if (i < 0 || i >= rows)
    return false;
  if (j < 0 || j >= columns)
    return false;

  return true;

}

function getCellCoordinatesByPosition(mouseX, mouseY) {
  if (mouseX < 0 || mouseY < 0)
    return null;
  var x = Math.floor(mouseX / cellSize);
  var y = Math.floor(mouseY / cellSize);
  if (x >= columns || y >= rows)
    return null;

  return {
    x: x,
    y: y
  };
}

function revealNearby(x, y, ) {
  if (!isOnBoard(x, y))
    return;

  var cell = board[x][y];
  if (cell.revealed) {
    return;
  }
  // TODO: Some other ifs.
  cell.reveal();
  if (cell.neighborCounter == 0) {
    revealNearby(x + 1, y);
    revealNearby(x + 1, y - 1);
    revealNearby(x + 1, y + 1);
    revealNearby(x - 1, y);
    revealNearby(x - 1, y - 1);
    revealNearby(x - 1, y + 1);
    revealNearby(x, y - 1);
    revealNearby(x, y + 1);
  }
}

function gameOver() {
  revealAll();
  isLost = true;
}

function revealAll() {
  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      board[x][y].reveal(true);
    }
  }
}

function isGameFinished() {
  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      var cell = board[x][y];
      if (!cell.revealed && !cell.mine) {
        return false
      }
    }
  }
  return true;
}

function restart(level) {
  // TODO: Confirm when game is in dev.
  switch (level) {
    case 0:
      columns = 10;
      rows = 10;
      mineChance = 0.1;
      break;
    case 1:
      columns = 16;
      rows = 16;
      mineChance = 0.156;
      break;
    case 2:
      columns = 30;
      rows = 20;
      mineChance = 0.17;
      break;

  }
  setup();
}

function mousePressed(event) {
  if (isLost || isWin)
    return;
  var coordinates = getCellCoordinatesByPosition(mouseX, mouseY);
  if (!coordinates)
    return;
  var cell = board[coordinates.x][coordinates.y];
  if (event.button === 2) {
    cell.toggleMark();
    return;
  } else {
    if (!cell.reveal())
      return;
    if (cell.mine) {
      gameOver();
      return;
    }
  }


  if (cell.neighborCounter == 0) {
    revealNearby(coordinates.x + 1, coordinates.y, cell.neighborCounter);
    revealNearby(coordinates.x + 1, coordinates.y - 1, cell.neighborCounter);
    revealNearby(coordinates.x + 1, coordinates.y + 1, cell.neighborCounter);
    revealNearby(coordinates.x - 1, coordinates.y, cell.neighborCounter);
    revealNearby(coordinates.x - 1, coordinates.y - 1, cell.neighborCounter);
    revealNearby(coordinates.x - 1, coordinates.y + 1, cell.neighborCounter);
    revealNearby(coordinates.x, coordinates.y - 1, cell.neighborCounter);
    revealNearby(coordinates.x, coordinates.y + 1, cell.neighborCounter);
  }
  if (isGameFinished()) {
    revealAll();
    isWin = true;
  }
}


function setup() {

  document.oncontextmenu = function () {
    return false;
  }

  console.log('Welcome o Mine Sweeper');
  isWin = false;
  isLost = false;
  createCanvas(cellSize * columns + 1, cellSize * rows + 1);
  board = create2DArray(rows, columns);
  setNeighborCounters();
}

function draw() {
  background(255);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      board[i][j].show();
    }
  }
  if (isLost || isWin) {
    var message = '';
    if (isLost) {
      fill(154, 3, 30);
      message = 'You loose';
    }

    if (isWin) {
      fill(0, 48, 73);
      message = 'You win';
    }
    textSize(cellSize);
    var x = (columns / 2) * cellSize - (cellSize * 2);
    var y = (rows / 2) * cellSize;
    text(message, x, y);
  }
}