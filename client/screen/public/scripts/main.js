const canvas = document.getElementById("device-diagram");
const ctx = canvas.getContext("2d");

// === Scale theo devicePixelRatio để nét không bị mờ ===
const dpr = window.devicePixelRatio || 1;
const width = 375;
const height = 280;

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
ctx.scale(dpr, dpr);

// === Vẽ sơ đồ mạng ===
function drawDevice(x, y, label, number) {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#1EB8F1";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 12, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(number, x + 20, y + 24);

    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 45);
}

function drawNetwork() {
    // Biểu tượng mạng trên cùng
    ctx.beginPath();
    ctx.arc(80, 30, 12, 0, 2 * Math.PI);
    ctx.fillStyle = "#007a8e";
    ctx.fill();
    ctx.fillStyle = "#00ffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("⌖", 80, 35);

    drawDevice(80, 100, "Trên đầu BOD", 8);
    drawDevice(190, 100, "Trên đầu web5", 3);
    drawDevice(300, 100, "Trong phòng họp", 1);
}

drawNetwork();

//Motion
const motionCanvas = document.getElementById("motion-diagram");
const motionCtx = motionCanvas.getContext("2d");
const x = 80;
const initY = 20;
const maxY = 70;
let y = initY;

function drawStreak() {
    if (!motionCtx || !motionCanvas) return;

    motionCtx.clearRect(x - 2, 0, 4, motionCanvas.height);
    motionCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';

    // Draw streak
    const gradient = motionCtx.createLinearGradient(x, y + 20, x, y);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    motionCtx.fillStyle = gradient;
    motionCtx.fillRect(x - 1, y, 2, 20);

    y += 0.5;
    if (y > maxY) y = initY;

    requestAnimationFrame(drawStreak);
}
drawStreak();

//Line
const lineCanvas = document.getElementById("line-diagram");
const lineCtx = lineCanvas.getContext("2d");
function drawLink(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.textAlign = "center";
    ctx.fillText("⇄", (x1 + x2) / 2, y1 - 8);
}
function drawLine() {
    // Dây nối xuống thiết bị
    lineCtx.beginPath();
    lineCtx.moveTo(80, 42);
    lineCtx.lineTo(80, 70);
    lineCtx.strokeStyle = "#00ffff";
    lineCtx.lineWidth = 2;
    lineCtx.stroke();

    drawLink(110, 100, 160, 100);
    drawLink(220, 100, 270, 100);
}
drawLine();