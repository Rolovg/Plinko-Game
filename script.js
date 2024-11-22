const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 400;
canvas.height = 600;

const pegs = [];
const balls = [];
const slots = [];
const multipliers = [];
const ballRadius = 8;
const pegRadius = 5;
const gravity = 0.1;
const bounceFactor = 0.7;
let score = 100;

// Initialize pegs
function setupPegs() {
  const rows = 10;
  const cols = 9;
  const spacingX = canvas.width / cols;
  const spacingY = 50;

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

// Draw pegs
function drawPegs() {
  ctx.fillStyle = 'black';
  pegs.forEach(peg => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Initialize slots and multipliers
function setupSlots() {
  const slotCount = 10;
  const slotWidth = canvas.width / slotCount;

  for (let i = 0; i < slotCount; i++) {
    slots.push({ x: i * slotWidth, width: slotWidth });
    multipliers.push(Math.floor(Math.random() * 5) + 1); // Random multiplier between 1 and 5
  }
}

// Draw slots and multipliers
function drawSlots() {
  ctx.fillStyle = 'gray';
  slots.forEach((slot, index) => {
    ctx.fillRect(slot.x, canvas.height - 30, slot.width, 30);
    ctx.fillStyle = 'blue';
    ctx.font = '16px Arial';
    ctx.fillText(`x${multipliers[index]}`, slot.x + slot.width / 2 - 10, canvas.height - 35);
  });
}

// Draw ball
function drawBall(ball) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

// Update ball physics
function updateBall(ball) {
  ball.vy += gravity; // Apply gravity
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with pegs
  pegs.forEach(peg => {
    const dx = ball.x - peg.x;
    const dy = ball.y - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pegRadius + ballRadius) {
      const angle = Math.atan2(dy, dx);
      ball.vx += Math.cos(angle) * bounceFactor;
      ball.vy -= Math.sin(angle) * bounceFactor;
    }
  });

  // Collision with walls
  if (ball.x < ballRadius || ball.x > canvas.width - ballRadius) {
    ball.vx *= -1;
  }

  // Collision with slots
  if (ball.y + ballRadius > canvas.height - 30) {
    ball.vy = 0;
    ball.vx = 0;
    ball.y = canvas.height - 30 - ballRadius;

    const slotIndex = Math.floor(ball.x / (canvas.width / slots.length));
    if (slotIndex >= 0 && slotIndex < slots.length) {
      score += multipliers[slotIndex];
      updateScore();
    }
  }
}

// Drop a ball
function dropBall() {
  score--; // Deduct 1 point per ball
  updateScore();

  const ball = {
    x: canvas.width / 2,
    y: ballRadius,
    vx: Math.random() * 2 - 1, // Random horizontal velocity
    vy: 0
  };
  balls.push(ball);
}

// Update the score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
}

// Game update loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPegs();
  drawSlots();
  balls.forEach(ball => {
    updateBall(ball);
    drawBall(ball);
  });
  requestAnimationFrame(update);
}

// Spacebar to drop a ball
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    dropBall();
  }
});

// Initialize game
setupPegs();
setupSlots();
update();
