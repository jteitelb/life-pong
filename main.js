const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const newColors = document.getElementById("newColors");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");

const balls = [];
const colors = [];

function generateBalls() {
  balls.length = 0;
  colors.length = 0;
  for (let i = 0; i < 3; i++) {
    let red = parseInt(Math.random() * 256);
    let green = parseInt(Math.random() * 256);
    let blue = parseInt(Math.random() * 256);
    colors.push(`rgb(${red}, ${green}, ${blue})`);
    color1.innerHTML = colors[0];
    color2.innerHTML = colors[1];
    color3.innerHTML = colors[2];
    for (let j = 0; j < 8; j++) {
      balls.push(
        new Ball(Math.random() * 330 + 20, Math.random() * 330 + 20, colors[i])
      );
    }
  }
}

newColors.addEventListener("click", generateBalls);

function renderBackground() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((i + j) % 2 == 0) {
        ctx.fillStyle = "#000";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fillRect(40 * i, 40 * j, 40, 40);
    }
  }
}

class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.color = color;
    this.dx = 6;
    this.dy = 5;
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
    ctx.closePath();
  }
}

function startFrames() {
  renderBackground();
  balls.forEach((ball) => {
    ball.render();
    ball.update();
  });

  window.requestAnimationFrame(startFrames);
}

startFrames();
