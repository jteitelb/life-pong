const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#eee";
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
