const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GLOBALS = {
  highlightedTile: { active: true, x: 9, y: 0 },
  nextHighlightFrame: 30,
};

const PROPS = [];

const CHARS = [];

function init() {}

function renderBackground() {
  if (GLOBALS.nextHighlightFrame > 0) {
    GLOBALS.nextHighlightFrame--;
  } else {
    GLOBALS.nextHighlightFrame = 30;
    GLOBALS.highlightedTile.x = Math.floor(Math.random() * 10);
    GLOBALS.highlightedTile.y = Math.floor(Math.random() * 10);
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (
        GLOBALS.highlightedTile.active &&
        GLOBALS.highlightedTile.x == i &&
        GLOBALS.highlightedTile.y == j
      ) {
        ctx.fillStyle = "#da4";
      } else if ((i + j) % 2 == 0) {
        ctx.fillStyle = "#000";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fillRect(40 * i, 40 * j, 40, 40);
    }
  }
}

function renderProps() {}

function renderCharacters() {}

function renderControls() {}

function startFrames() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderBackground();
  renderProps();
  renderCharacters();
  renderControls();

  window.requestAnimationFrame(startFrames);
}

startFrames();
