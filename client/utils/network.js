const si = require('systeminformation');
const ping = require('ping');
const { NETWORK_TYPES } = require('./const');

async function getNetwordInfo() {
  const type = await getConnectionType();

  let data = null;
  if (type === NETWORK_TYPES.WIFI) {
    data = await getWifiInfo();
  } else if (type === NETWORK_TYPES.WIRED) {
    data = await getWiredInfo();
  } 

  return {
    status: 'GOOD',
    type,
    data
  };
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
  const gateway = await si.networkGatewayDefault();
    console.log('Gateway:', gateway);
  const resLocal = await ping.promise.probe(gateway);
  const pingLocal = resLocal.alive ? resLocal.time : null;
  const pingInternet = await si.inetLatency();
  console.log('local ping:', pingLocal);

  // Lấy tốc độ upload/download (bytes per second), convert sang Mbps
  const stats = await si.networkStats(connection.iface || '');
  const tx = stats?.[0]?.tx_sec || 0;
  const rx = stats?.[0]?.rx_sec || 0;
  const uploadMbps = (tx * 8 / 1_000_000).toFixed(2);
  const downloadMbps = (rx * 8 / 1_000_000).toFixed(2);

  return {
    
    ssid: connection.ssid || '(unknown)',
    band,
    rssi,
    ping: {
      internet: pingInternet,
      local: pingLocal,
    },
    uploadMbps,
    downloadMbps,
  };
}

async function getWiredInfo() {
  const interfaces = await si.networkInterfaces();
  const wired = interfaces.find(i => i.operstate === 'up' && i.type === 'wired' && i.default);
  if (!wired) return null;

  const speed = wired.speed || null; // Mbps
  const gateway = await si.networkGatewayDefault();
  console.log('Gateway:', gateway);
  const resLocal = await ping.promise.probe(gateway);
  const pingLocal = resLocal.alive ? resLocal.time : null;
  const pingInternet = await si.inetLatency();
  console.log('local ping:', pingLocal);
  return {
    speed, 
    ping: {
      internet: pingInternet,
      local: pingLocal,
    },
  };
}

module.exports = { getNetwordInfo };