const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

const balls = [];

for (let i = 0; i < 3; i++) {
  let red = Math.random() * 256;
  let green = Math.random() * 256;
  let blue = Math.random() * 256;
  for (let i = 0; i < 8; i++) {
    balls.push(
      new Ball(
        Math.random() * 330 + 20,
        Math.random() * 330 + 20,
        `rgb(${red}, ${green}, ${blue})`
      )
    );
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
