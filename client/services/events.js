const { BrowserWindow } = require('electron');
const { 
  getNetworkInfo, 
  getPingToDefaultGateway, 
  getPingToDomestic, 
  getPingToInternational, 
  getPingToPublicIP, 
  getNetworkStatus 
} = require('../utils/network');

class SystemEvent {
  constructor() {
    this.networkInterval = null;
    this.pingInterval = null;
    this.networkData = {};
  }

  start() {
    this.emitPingDomesticInfo();
    this.emitNetworkInfo();
    this.emitPingDefaultGatewayInfo();
    this.emitPingPublicIPInfo();
    this.emitPingInternationalInfo();

    this.networkInterval = setInterval(() => this.emitNetworkInfo(), 5000);
    this.pingInterval = setInterval(() => this.emitPingDefaultGatewayInfo(), 1000);
    this.pingInterval = setInterval(() => this.emitPingPublicIPInfo(), 1000);
    this.pingInterval = setInterval(() => this.emitPingDomesticInfo(), 10000);
    this.pingInterval = setInterval(() => this.emitPingInternationalInfo(), 30000);
  }

  stop() {
    clearInterval(this.networkInterval);
    clearInterval(this.pingInterval);
  }

  parseNetworkData() {
    const parsedData = {};
    for (const k in this.networkData) {
      try {
        parsedData[k] = JSON.parse(this.networkData[k]);
      } catch (e) {
        parsedData[k] = null;
      }
    }
    return parsedData;
  }

  updateAndBroadcast(key, value) {
    if (this.networkData[key] !== JSON.stringify(value)) {
      this.networkData[key] = JSON.stringify(value);

      const parsedData = this.parseNetworkData();

      this.broadcast(parsedData);
      console.log('Updated network data:', parsedData);
    }
  }

  emitNetworkInfo() {
    getNetworkInfo().then((info) => {
      this.updateAndBroadcast('network_info', info);
    });
  }

  emitPingDefaultGatewayInfo() {
    getPingToDefaultGateway().then((info) => {
      this.updateAndBroadcast('ping_default_gateway', info);
    });
  }

  emitPingDomesticInfo() {
    getPingToDomestic().then((info) => {
      this.updateAndBroadcast('ping_domestic', info);
      this.updateAndBroadcast('ping_domestic_status', getNetworkStatus(info));
    });
  }

  emitPingInternationalInfo() {
    getPingToInternational().then((info) => {
      this.updateAndBroadcast('ping_international', info);
    });
  }

  emitPingPublicIPInfo() {
    getPingToPublicIP().then((info) => {
      this.updateAndBroadcast('ping_public_ip', info);
    });
  }

  getCurrentNetworkInfo() {
    return this.parseNetworkData();
  }

  broadcast(payload) {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('network_event', payload)
    });
  }
}

module.exports = SystemEvent;