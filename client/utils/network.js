const si = require('systeminformation');
const ping = require('ping');
const { NETWORK_TYPES, NETWORK_STATUS, PING_DOMAIN } = require('./const');

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

async function getPingInfo() {
  const gateway = await si.networkGatewayDefault();
  const resLocal = await ping.promise.probe(gateway);
  const resDomestic = await ping.promise.probe(PING_DOMAIN.DOMESTIC);
  const resInternational = await ping.promise.probe(PING_DOMAIN.INTERNATIONAL);

  const pingLocal = resLocal.alive ? resLocal.time : null;
  const pingDomestic = resDomestic.alive ? resDomestic.time : null;
  const pingInternational = resInternational.alive ? resInternational.time : null;

  let status = NETWORK_STATUS.OFFLINE;
  if (pingInternational != null) {
    if (pingInternational < 50) status = NETWORK_STATUS.GOOD;
    else if (pingInternational < 150) status = NETWORK_STATUS.SLOW;
  }

  return {
    status,
    ping: {
      local: pingLocal,
      domestic: pingDomestic,
      international: pingInternational
    }
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

module.exports = { getNetworkInfo, getPingInfo };