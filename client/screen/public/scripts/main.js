import { updateNetworkInfo, updateNetworkStatus, updatePing } from './statusUpdater.js';

const canvas = document.getElementById("device-diagram");
const ctx = canvas.getContext("2d");
const netIcon = document.getElementById("netIcon");
const routerIcon = document.getElementById("routerIcon");
const plugIcon = document.getElementById("plugIcon");
const wifiIcon = document.getElementById("wifiIcon");
const macIcon = document.getElementById('macIcon');
const windowsIcon = document.getElementById('windowsIcon');
const linuxIcon = document.getElementById('linuxIcon');
let isInternetConnected = true;
let isDeviceConnected = false;

// === Scale theo devicePixelRatio để nét không bị mờ ===
const dpr = window.devicePixelRatio || 1;
const width = 375;
const height = 280;

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
ctx.scale(dpr, dpr);

const { device } = await window.electronAPI.getDeviceInfo();
const os = device.os;
const popoverTail = document.querySelector('.popover-tail');
if (os === 'windows') {
    popoverTail.style.display = 'none';
} else {
  popoverTail.style.display = 'block';
}

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

function drawNetwork(userDeviceIcon) {
  const iconX = 80;
  const iconY = 30;
  const iconRadius = 15;

  function render() {
    drawIconWithCircle(iconX, iconY, iconRadius, netIcon);

    drawDevice(80, 140, "Trên đầu BOD", routerIcon);
    drawDevice(190, 140, "Trên đầu web5", routerIcon);
    drawDevice(300, 140, "Máy của tôi", userDeviceIcon);
  }

  // Đảm bảo icon đã tải trước khi vẽ
  if (netIcon.complete) {
    render();
  } else {
    netIcon.onload = render;
  }
}

async function getDeviceInformation() {
  const { device } = await window.electronAPI.getDeviceInfo();
  console.log('🟢 Nhận thông tin thiết bị:', device);
  const os = device.os;

  const osIcon =
    os === 'windows' ? windowsIcon :
      os === 'linux' ? linuxIcon :
        os === 'mac' ? macIcon :
          routerIcon;

  drawNetwork(osIcon);
}

getDeviceInformation();

//Motion
const motionCanvas = document.getElementById("motion-diagram");
const motionCtx = motionCanvas.getContext("2d");

const startLightColor = 'rgba(76,221,252,1)';
const endLightColor = 'rgba(76,221,252,0)';

const light1InitX = 80;
const light1InitY = 10;
const light1MaxY = 100;
let p1 = light1InitY;

// New horizontal streaks
const light2InitX = 70;
const light2InitY = 140;
const light2MaxX = 160;
let p2 = light2InitX;

const light3InitX = 180;
const light3InitY = 140;
const light3MaxX = 270;
let p3 = light3InitX;

function drawMotion() {
  if (!motionCtx || !motionCanvas) return;

  motionCtx.clearRect(0, 0, motionCanvas.width, motionCanvas.height);

  // === Vertical streak (Internet xuống BOD)
  const vGradient = motionCtx.createLinearGradient(light1InitX, p1 + 30, light1InitX, p1);
  vGradient.addColorStop(0, startLightColor);
  vGradient.addColorStop(1, endLightColor);
  motionCtx.fillStyle = vGradient;
  motionCtx.fillRect(light1InitX - 1, p1, 2, 30);
  p1 += 0.8;
  if (p1 > light1MaxY) p1 = light1InitY;

  // === Horizontal streak 1 (BOD → Web5)
  if (isInternetConnected) {
    const hGradient1 = motionCtx.createLinearGradient(p2, light2InitY, p2 + 30, light2InitY);
    hGradient1.addColorStop(0, endLightColor);
    hGradient1.addColorStop(1, startLightColor);
    motionCtx.fillStyle = hGradient1;
    motionCtx.fillRect(p2, light2InitY - 1, 30, 2);
    p2 += 0.8;
    if (p2 > light2MaxX) p2 = light2InitX;
  }

  // === Horizontal streak 2 (Web5 → Máy tôi)
  if (isDeviceConnected) {
    const hGradient2 = motionCtx.createLinearGradient(p3, light3InitY, p3 + 30, light3InitY);
    hGradient2.addColorStop(0, endLightColor);
    hGradient2.addColorStop(1, startLightColor);
    motionCtx.fillStyle = hGradient2;
    motionCtx.fillRect(p3, light3InitY - 1, 30, 2);
    p3 += 0.8;
    if (p3 > light3MaxX) p3 = light3InitX;
  }

  requestAnimationFrame(drawMotion);
}
drawMotion();

//Line
const lineCanvas = document.getElementById("line-diagram");
const lineCtx = lineCanvas.getContext("2d");

let latestNetworkInfo = null;

function drawLink(x1, y1, x2, y2, type = 'wired', isConnected = false) {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  lineCtx.beginPath();
  lineCtx.moveTo(x1, y1);
  lineCtx.lineTo(x2, y2);
  lineCtx.strokeStyle = isConnected ? "#0a4a5b" : "#ff4d4f";
  lineCtx.lineWidth = 2;
  lineCtx.stroke();

  if (!isConnected) {
    lineCtx.strokeStyle = "#ff4d4f";
    lineCtx.lineWidth = 2;
    lineCtx.beginPath();
    lineCtx.moveTo(centerX - 6, centerY - 6);
    lineCtx.lineTo(centerX + 6, centerY + 6);
    lineCtx.moveTo(centerX + 6, centerY - 6);
    lineCtx.lineTo(centerX - 6, centerY + 6);
    lineCtx.stroke();
    return;
  }

  const iconSize = 13;
  const iconWifiSize = 16;
  const iconY = y1 - 12;

  if (type === 'wired') {
    if (plugIcon?.complete) {
      lineCtx.drawImage(plugIcon, centerX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
    } else if (plugIcon) {
      plugIcon.onload = () => {
        lineCtx.drawImage(plugIcon, centerX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
      };
    }
  } else if (type === 'wifi') {
    if (wifiIcon?.complete) {
      lineCtx.drawImage(wifiIcon, centerX - iconWifiSize / 2, iconY - iconWifiSize / 1.5, iconWifiSize, iconWifiSize);
    } else if (wifiIcon) {
      wifiIcon.onload = () => {
        lineCtx.drawImage(wifiIcon, centerX - iconWifiSize / 2, iconY - iconWifiSize / 1.5, iconWifiSize, iconWifiSize);
      };
    }
  }
}
function drawLine() {
  // Xoá nội dung canvas cũ
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

  // Dây nối xuống thiết bị
  lineCtx.beginPath();
  lineCtx.moveTo(80, 42);
  lineCtx.lineTo(80, 140);
  lineCtx.strokeStyle = "#0a4a5b";
  lineCtx.lineWidth = 2;
  lineCtx.stroke();

  drawLink(110, 140, 160, 140, 'wired', isInternetConnected);

  const type = latestNetworkInfo?.type ?? 'unknown';
  drawLink(220, 140, 270, 140, type, isDeviceConnected);
}
drawLine();


window.electronAPI.onNetworkUpdate((data) => {
  latestNetworkInfo = data?.network_info;
  updateNetworkInfo(data?.network_info);
  drawLine();
  updateNetworkStatus(data?.ping_domestic_status);
  updatePing(data?.ping_domestic, 'internet');
  updatePing(data?.ping_public_ip, 'local');
});
