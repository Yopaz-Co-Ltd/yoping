const axios = require('axios');
const si = require('systeminformation');
const ping = require('ping');
const { NETWORK_TYPES, PING_DOMAIN, NETWORK_STATUS } = require('./const');
const { showNotification } = require('./notification');

let lastNotificationTime = 0;

async function getNetworkInfo() {
  const type = await getConnectionType();

  let data = null;
  if (type === NETWORK_TYPES.WIFI) {
    data = await getWifiInfo();
  } else if (type === NETWORK_TYPES.WIRED) {
    data = await getWiredInfo();
  }

  return {
    type,
    data
  };
}

async function getPingToDefaultGateway() {
  const gateway = await si.networkGatewayDefault();
  const res = await ping.promise.probe(gateway, { timeout: 1 });
  return res.alive ? res.time : null;
}

async function getPingToPublicIP() {
  let ip;
  try {
    const response = await axios.get('https://api.ipify.org?format=json', { timeout: 1000 });
    ip = response.data.ip;
  } catch (error) {
    return null;
  }
  const res = await ping.promise.probe(ip, { timeout: 1 });
  return res.alive ? res.time : null;
}

async function getPingToDomestic() {
  const res = await ping.promise.probe(PING_DOMAIN.DOMESTIC, { timeout: 1 });
  return res.alive ? res.time : null;
}

async function getPingToInternational() {
  const res = await ping.promise.probe(PING_DOMAIN.INTERNATIONAL, { timeout: 1 });
  return res.alive ? res.time : null;
}

async function getConnectionType() {
  const net = await si.networkInterfaces();
  const active = net.find(i => i.operstate === 'up' && i.default);
  if (!active) return NETWORK_TYPES.UNKNOWN;
  return active.type === 'wireless' ? NETWORK_TYPES.WIFI : NETWORK_TYPES.WIRED;
}

async function getWifiInfo() {
  const net = await si.wifiConnections();
  if (!net || net.length === 0) return null;

  const connection = net[0];
  const rssi = connection.signalLevel || null;
  const freq = connection.frequency || 0;
  const band = freq >= 4900 ? '5GHz' : '2.4GHz';

  return {
    ssid: connection.ssid || '(unknown)',
    band,
    rssi,
  };
}

async function getWiredInfo() {
  const interfaces = await si.networkInterfaces();
  const wired = interfaces.find(i => i.operstate === 'up' && i.type === 'wired' && i.default);
  if (!wired) return null;

  const speed = wired.speed || null;

  return {
    speed,
  };
}

function getNetworkStatus(ping) {
  const now = Date.now();

  const PING_GOOD_THRESHOLD = 50;
  const PING_OFFLINE_THRESHOLD = 300;
  const NOTIFICATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

  const shouldNotify = !ping || ping >= PING_OFFLINE_THRESHOLD;

  if (shouldNotify) {
    if (now - lastNotificationTime > NOTIFICATION_INTERVAL) {
      showNotification();
      lastNotificationTime = now;
    }
    return NETWORK_STATUS.OFFLINE;
  }

  lastNotificationTime = 0;
  return ping < PING_GOOD_THRESHOLD ? NETWORK_STATUS.GOOD : NETWORK_STATUS.SLOW;
}

module.exports = {
  getNetworkInfo,
  getPingToDefaultGateway,
  getPingToPublicIP, 
  getPingToDomestic, 
  getPingToInternational,
  getNetworkStatus
};