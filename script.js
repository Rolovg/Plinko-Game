const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');


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
  ctx.fillStyle = 'black';
  pegs.forEach(peg => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}


function setupSlots() {
  const slotCount = 10;
  const slotWidth = canvas.width / slotCount;
  for (let i = 0; i < slotCount; i++) {
    slots.push({ x: i * slotWidth, width: slotWidth });
    multipliers.push(Math.floor(Math.random() * 5) + 1); 
  }
}

function drawSlots() {
  ctx.fillStyle = 'gray';
  slots.forEach((slot, index) => {
    ctx.fillRect(slot.x, canvas.height - 30, slot.width, 30);
    ctx.fillStyle = 'blue';
    ctx.font = '16px Arial';
    ctx.fillText(`x${multipliers[index]}`, slot.x + slot.width / 2 - 10, canvas.height - 35);
  });
}

function drawBall(ball) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}


function updateBall(ball) {
  ball.vy += gravity; 
  ball.x += ball.vx;
  ball.y += ball.vy;

  pegs.forEach(peg => {
    const dx
