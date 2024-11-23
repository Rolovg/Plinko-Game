const canvas = document.getElementById("plinkoCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 550;

const pegs = [];
const balls = [];
const slots = [];
const ballRadius = 8;
const pegRadius = 5;
const gravity = 0.2;
const bounceFactor = 0.6;
const slotCount = 9; 
let score = 100;

function generateMultipliers() {
  const center = Math.floor(slotCount / 2);
  const multipliers = [];
  for (let i = 0; i < slotCount; i++) {
    const distanceFromCenter = Math.abs(center - i);
    if (distanceFromCenter === 0) {
      multipliers.push(0.2); // Loss multiplier at the center
    } else if (distanceFromCenter === 1) {
      multipliers.push(0.5); // Slight loss near the center
    } else if (distanceFromCenter === 2) {
      multipliers.push(1); // Break even
    } else if (distanceFromCenter === 3) {
      multipliers.push(2); // Small win
    } else {
      multipliers.push(4); // Big win at the edges
    }
  }
  return multipliers;
}

const multipliers = generateMultipliers();

function setupPegs() {
  const rows = 12;
  const cols = 9;
  const spacingX = canvas.width / cols;
  const spacingY = 40;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacingX + (row % 2 === 0 ? spacingX / 2 : 0);
      const y = row * spacingY + 50;
      if (x > pegRadius && x < canvas.width - pegRadius) {
        pegs.push({ x, y });
      }
    }
  }
}

function drawPegs() {
  ctx.fillStyle = "white";
  pegs.forEach((peg) => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function setupSlots() {
  const slotWidth = canvas.width / slotCount;
  for (let i = 0; i < slotCount; i++) {
    slots.push({
      x: i * slotWidth,
      width: slotWidth,
      multiplier: multipliers[i],
    });
  }
}

function drawSlots() {
  slots.forEach((slot) => {
    ctx.fillStyle = "#444";
    ctx.fillRect(slot.x, canvas.height - 30, slot.width, 30);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(
      `${slot.multiplier}x`,
      slot.x + slot.width / 2 - 10,
      canvas.height - 10
    );
  });
}

function drawBall(ball) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

function updateBall(ball, index) {
  ball.vy += gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  pegs.forEach((peg) => {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pegRadius + ballRadius) {
      const angle = Math.atan2(dy, dx);
      ball.vx += Math.cos(angle) * bounceFactor;
      ball.vy -= Math.sin(angle) * bounceFactor;
    }
  });

  if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas.width) {
    ball.vx *= -1;
  }

  if (ball.y + ballRadius > canvas.height - 30) {
    const slotIndex = Math.floor(ball.x / (canvas.width / slotCount));
    const earned = Math.floor(multipliers[slotIndex] * 10);
    score += earned - 10; // Subtract the ball cost (1 point = 10)
    updateScore();
    balls.splice(index, 1);
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function dropBall() {
  if (score >= 10) {
    score -= 10; // Cost of dropping a ball
    updateScore();
    balls.push({
      x: canvas.width / 2,
      y: ballRadius,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
    });
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPegs();
  drawSlots();
  balls.forEach((ball, i) => {
    updateBall(ball, i);
    drawBall(ball);
  });
  requestAnimationFrame(update);
}

setupPegs();
setupSlots();
update();
document.getElementById("dropBall").addEventListener("click", dropBall);


