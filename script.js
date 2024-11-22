const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const pegs = [];
const balls = [];
const slots = [];
const ballRadius = 8;
const pegRadius = 5;
const gravity = 0.1;
const bounceFactor = 0.7;

let score = 100;
let ballCost = 1; 
const slotMultipliers = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]; 

function drawScore() {
    ctx.fillStyle = 'lime';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
}


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
    ctx.fillStyle = 'aqua';
    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}


function setupSlots() {
    const slotCount = slotMultipliers.length;
    const slotWidth = canvas.width / slotCount;
    for (let i = 0; i < slotCount; i++) {
        slots.push({ x: i * slotWidth, width: slotWidth, multiplier: slotMultipliers[i] });
    }
}

function drawSlots() {
    slots.forEach(slot => {
        ctx.fillStyle = 'purple';
        ctx.fillRect(slot.x, canvas.height - 30, slot.width, 30);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`x${slot.multiplier}`, slot.x + slot.width / 2 - 10, canvas.height - 10);
    });
}

function drawBall(ball) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'yellow'; 
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
}


function updateBall(ball, index) {
    ball.vy += gravity; 
    ball.x += ball.vx;
    ball.y += ball.vy;

  
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

  
    if (ball.x < ballRadius || ball.x > canvas.width - ballRadius) {
        ball.vx *= -1;
    }

    
    if (ball.y + ballRadius >= canvas.height - 30) {
        const slot = slots.find(slot => ball.x >= slot.x && ball.x < slot.x + slot.width);
        if (slot && !ball.scored) {
            score += slot.multiplier; 
            ball.scored = true; 
        }
        balls.splice(index, 1); 
    }
}


function dropBall() {
    if (score >= ballCost) {
        score -= ballCost; 
        const ball = {
            x: canvas.width / 2,
            y: ballRadius,
            vx: Math.random() * 2 - 1, 
            vy: 0,
            scored: false
        };
        balls.push(ball);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    drawSlots();
    drawScore();

    balls.forEach((ball, index) => updateBall(ball, index));
    balls.forEach(ball => drawBall(ball));

    requestAnimationFrame(update);
}

setupPegs();
setupSlots();
update();
