const si = require('systeminformation');
const { NETWORK_TYPES } = require('./const');

async function getConnectionType() {
  const net = await si.networkInterfaces();
  const active = net.find(i => i.operstate === 'up' && i.default);
  if (!active) return NETWORK_TYPES.UNKNOWN;
  return active.type === 'wireless' ? NETWORK_TYPES.WIFI : NETWORK_TYPES.WIRED;
}

module.exports = { getConnectionType };