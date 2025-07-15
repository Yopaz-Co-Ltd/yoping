const canvas = document.getElementById("device-diagram");
const ctx = canvas.getContext("2d");
const netIcon = document.getElementById("netIcon");
const routerIcon = document.getElementById("routerIcon");
const plugIcon = document.getElementById("plugIcon");

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
function drawDevice(x, y, label, deviceImg) {
  // Vẽ hình tròn chính
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#1EB8F1";
  ctx.fill();

  if (deviceImg && deviceImg.complete) {
    ctx.drawImage(deviceImg, x - 16, y - 16, 32, 32);
  } else if (deviceImg) {
    deviceImg.onload = () => {
      ctx.drawImage(deviceImg, x - 16, y - 16, 32, 32);
    };
  }

  // Vẽ nhãn bên dưới
  ctx.fillStyle = "#fff";
  ctx.font = "11px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 45);
}

function drawIconWithCircle(x, y, radius, iconImg, iconSize = 26, circleColor = "#0a4a5b") {
  // Vẽ hình tròn bao quanh icon
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = circleColor;
  ctx.shadowColor = "#1bb4d0";
  ctx.shadowBlur = 7;
  ctx.fill();

  // Vẽ icon căn giữa
  ctx.drawImage(iconImg, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
}

function drawNetwork() {
  const iconX = 80;
  const iconY = 30;
  const iconRadius = 15;

  function render() {
    drawIconWithCircle(iconX, iconY, iconRadius, netIcon);

    drawDevice(80, 140, "Trên đầu BOD", routerIcon);
    drawDevice(190, 140, "Trên đầu web5", routerIcon);
    drawDevice(300, 140, "Trong phòng họp", routerIcon);
  }

  // Đảm bảo icon đã tải trước khi vẽ
  if (netIcon.complete) {
    render();
  } else {
    netIcon.onload = render;
  }
}
drawNetwork();

//Motion
const motionCanvas = document.getElementById("motion-diagram");
const motionCtx = motionCanvas.getContext("2d");
const x = 80;
const initY = 10;
const maxY = 100;
let y = initY;

function drawMotion() {
  if (!motionCtx || !motionCanvas) return;

  motionCtx.clearRect(x - 2, 0, 4, motionCanvas.height);
  motionCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';

  // Draw streak
  const gradient = motionCtx.createLinearGradient(x, y + 30, x, y);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  motionCtx.fillStyle = gradient;
  motionCtx.fillRect(x - 1, y, 2, 30);

  y += 0.8;
  if (y > maxY) y = initY;

  requestAnimationFrame(drawMotion);
}
drawMotion();

//Line
const lineCanvas = document.getElementById("line-diagram");
const lineCtx = lineCanvas.getContext("2d");
function drawLink(x1, y1, x2, y2) {
  lineCtx.beginPath();
  lineCtx.moveTo(x1, y1);
  lineCtx.lineTo(x2, y2);
  lineCtx.strokeStyle = "#0a4a5b";
  lineCtx.lineWidth = 2;
  lineCtx.stroke();

  const centerX = (x1 + x2) / 2;
  const centerY = y1 - 12;
  const iconSize = 13;

  if (plugIcon && plugIcon.complete) {
    lineCtx.drawImage(plugIcon, centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
  } else if (plugIcon) {
    plugIcon.onload = () => {
      lineCtx.drawImage(plugIcon, centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
    };
  }
}
function drawLine() {
  // Dây nối xuống thiết bị
  lineCtx.beginPath();
  lineCtx.moveTo(80, 42);
  lineCtx.lineTo(80, 140);
  lineCtx.strokeStyle = "#0a4a5b";
  lineCtx.lineWidth = 2;
  lineCtx.stroke();

  drawLink(110, 140, 160, 140);
  drawLink(220, 140, 270, 140);
}
drawLine();