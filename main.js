const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toggleGridButton = document.getElementById("toggleGrid");

const runLifeButton = document.getElementById("runLife");
const stepLifeButton = document.getElementById("stepLife");
const resetLifeButton = document.getElementById("resetLife");
const randomizeLifeButton = document.getElementById("randomizeLife");

const runPongButton = document.getElementById("runPong");
const resetPongButton = document.getElementById("resetPong");
const blackSpeedButton = document.getElementById("blackSpeed");
const whiteSpeedButton = document.getElementById("whiteSpeed");

const SCREEN_SIZE = 400;
canvas.width = SCREEN_SIZE;
canvas.height = SCREEN_SIZE;

const GRID_SIZE = 12;
const CELL_SIZE = SCREEN_SIZE / GRID_SIZE;
const BALL_RADIUS = CELL_SIZE / 2;

const STEP_TIME = 30; // frames per game of life step
const BALL_SPEED = 6;

const GAME_SPEED = 1; // number of updates per frame

const SPEED_OPTIONS = [2, 6, 15];

const TIMERS = {
  NEXT_STEP: STEP_TIME,
  tick() {
    this.NEXT_STEP--;
  },
};

function initGrid() {
  let grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = i >= GRID_SIZE / 2 ? 1 : 0; // half black, half white
    }
  }
  return grid;
}

function randomizeGrid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = Math.floor(Math.random() * 2);
    }
  }
}

function canvasCoordsToGrid(x, y) {
  return [Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE)];
}

/****************************
  Game of Life Functions
 ***************************/
function countNeighbors(i, j) {
  let neighbors = 0;

  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      // neighbor coordinates
      const ni = i + di;
      const nj = j + dj;

      neighbors += grid[ni]?.[nj] || 0;
    }
  }
  neighbors -= grid[i][j];

  return neighbors;
}

function nextGeneration() {
  let nextGen = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    nextGen[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      let neighbors = countNeighbors(i, j);

      if (grid[i][j] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          nextGen[i][j] = 0;
        } else {
          nextGen[i][j] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGen[i][j] = 1;
        } else {
          nextGen[i][j] = 0;
        }
      }
    }
  }
  return nextGen;
}

/********************
 * Canvas Rendering
 * ******************/

function renderBackground() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        ctx.fillStyle = "#fff";
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fillRect(CELL_SIZE * i, CELL_SIZE * j, CELL_SIZE, CELL_SIZE);
      if (showGridlines) {
        ctx.strokeStyle = "#888";
        ctx.strokeRect(CELL_SIZE * i, CELL_SIZE * j, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = BALL_RADIUS;
    this.color = color;
    this.strokeColor = color === "black" ? "white" : "black";
    this.currentSpeed = BALL_SPEED;
    this.dx = BALL_SPEED * (6 / 5);
    this.dy = BALL_SPEED;
    this.colorType = color === "black" ? 1 : 0;
  }

  setSpeed(speed) {
    const ratio = speed / this.currentSpeed;
    this.dx *= ratio;
    this.dy *= ratio;
    this.currentSpeed = speed;
  }

  cycleSpeed() {
    const idx = SPEED_OPTIONS.indexOf(this.currentSpeed);
    const nextIdx = (idx + 1) % SPEED_OPTIONS.length;
    this.setSpeed(SPEED_OPTIONS[nextIdx]);
    return nextIdx;
  }

  checkBoundaryCollision() {
    if (
      this.x + this.radius + this.dx > canvas.width ||
      this.x - this.radius + this.dx < 0
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.radius + this.dy > canvas.height ||
      this.y - this.radius + this.dy < 0
    ) {
      this.dy = -this.dy;
    }
  }

  checkCellCollision() {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const x = this.x + Math.cos(angle) * this.radius;
      const y = this.y + Math.sin(angle) * this.radius;
      const [i, j] = canvasCoordsToGrid(x, y);

      if (grid[i]?.[j] === this.colorType) {
        const ratio = Math.abs(Math.tan(angle));
        // if (Math.abs(ratio - 1) < 0.1) {
        //   this.dx = -this.dx;
        //   this.dy = -this.dy;
        // } else
        if (ratio > 1) {
          this.dy = -this.dy;
        } else {
          this.dx = -this.dx;
        }
        grid[i][j] = 1 - grid[i][j];
        break;
      }
    }
  }

  update() {
    this.checkCellCollision();
    this.checkBoundaryCollision();
    this.x += this.dx;
    this.y += this.dy;
  }

  render() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }
    ctx.closePath();
  }
}

/***************
 * Game Setup
 ***************/

// Initializations
const ball_array = [];
let stroke = false;
let showGridlines = false;
let life_running = false;
let pong_running = true;
let grid = initGrid();

const p1 = SCREEN_SIZE / 5;
const p2 = SCREEN_SIZE - p1;

const blackBall = new Ball(p1, p1 + CELL_SIZE * 2, "black");
const whiteBall = new Ball(p2, p2 - CELL_SIZE, "white");

whiteBall.dx = -blackBall.dx;
whiteBall.dy = -blackBall.dy;

ball_array.push(blackBall);
ball_array.push(whiteBall);

function update() {
  if (pong_running) {
    ball_array.forEach((ball) => {
      ball.update();
    });
  }

  if (life_running) {
    if (TIMERS.NEXT_STEP === 0) {
      grid = nextGeneration();
      TIMERS.NEXT_STEP = STEP_TIME;
    }
    TIMERS.tick();
  }
}
// Game Loop
function startFrames() {
  renderBackground();

  for (let i = 0; i < GAME_SPEED; i++) {
    update();
  }

  ball_array.forEach((ball) => {
    ball.render();
  });

  window.requestAnimationFrame(startFrames);
}

function flipCell(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(canvasCoordsToGrid(x, y));

  const [i, j] = canvasCoordsToGrid(x, y);
  grid[i][j] = 1 - grid[i][j];
}

/*******************
 * Event Listeners
 *******************/

canvas.addEventListener("click", flipCell);

toggleGridButton.addEventListener("click", () => {
  showGridlines = !showGridlines;
  toggleGridButton.innerHTML = showGridlines ? "Hide Grid" : "Show Grid";
});

runLifeButton.addEventListener("click", () => {
  life_running = !life_running;
  runLifeButton.innerHTML = life_running ? "Stop" : "Start";
});

stepLifeButton.addEventListener("click", () => {
  grid = nextGeneration();
});

resetLifeButton.addEventListener("click", () => {
  grid = initGrid();
});

randomizeLifeButton.addEventListener("click", () => {
  randomizeGrid();
});

runPongButton.addEventListener("click", () => {
  pong_running = !pong_running;
  runPongButton.innerHTML = pong_running ? "Stop" : "Start";
  console.log(`black: ${canvasCoordsToGrid(blackBall.x, blackBall.y)}`);
  console.log(`white: ${canvasCoordsToGrid(whiteBall.x, whiteBall.y)}`);
});

resetPongButton.addEventListener("click", () => {
  blackBall.x = p1;
  blackBall.y = p1 + CELL_SIZE * 2;
  whiteBall.x = p2;
  whiteBall.y = p2 - CELL_SIZE;
});

blackSpeedButton.addEventListener("click", () => {
  const speedStr = ["Slow", "Medium", "Fast"][blackBall.cycleSpeed()];
  blackSpeedButton.innerHTML = `Black: ${speedStr}`;
});

whiteSpeedButton.addEventListener("click", () => {
  const speedStr = ["Slow", "Medium", "Fast"][whiteBall.cycleSpeed()];
  whiteSpeedButton.innerHTML = `White: ${speedStr}`;
});

// Run it!
startFrames();
