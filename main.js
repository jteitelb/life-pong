const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const runLifeButton = document.getElementById("runLife");
const stepLifeButton = document.getElementById("stepLife");
const resetLifeButton = document.getElementById("resetLife");
const randomizeLifeButton = document.getElementById("randomizeLife");

const SCREEN_SIZE = 400;
canvas.width = SCREEN_SIZE;
canvas.height = SCREEN_SIZE;

const GRID_SIZE = 10;
const CELL_SIZE = SCREEN_SIZE / GRID_SIZE;

const STEP_TIME = 15; // frames per game of life step
const BALL_SPEED = 1;

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
    }
  }
}

class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.color = color;
    this.strokeColor = color === "black" ? "white" : "black";
    this.dx = BALL_SPEED * 5;
    this.dy = BALL_SPEED * 4;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
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
const balls = [];
let stroke = false;
let run_life = false;
let grid = initGrid();

const p1 = CELL_SIZE * 3;
const p2 = SCREEN_SIZE - p1;

const blackBall = new Ball(p1, p1 + CELL_SIZE, "black");
const whiteBall = new Ball(p2, p2 - CELL_SIZE, "white");
whiteBall.dx = -blackBall.dx;
whiteBall.dy = -blackBall.dy;

balls.push(blackBall, whiteBall);

// Game Loop
function startFrames() {
  renderBackground();
  balls.forEach((ball) => {
    ball.render();
    ball.update();
  });

  if (run_life) {
    if (TIMERS.NEXT_STEP === 0) {
      grid = nextGeneration();
      TIMERS.NEXT_STEP = STEP_TIME;
    }
    TIMERS.tick();
  }

  window.requestAnimationFrame(startFrames);
}

/*******************
 * Event Listeners
 *******************/

runLifeButton.addEventListener("click", () => {
  run_life = !run_life;
  runLifeButton.innerHTML = run_life ? "Stop" : "Start";
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

// Run it!
startFrames();
