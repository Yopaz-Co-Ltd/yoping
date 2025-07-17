const { BrowserWindow } = require('electron');
const { getNetworkInfo, getPingInfo } = require('../utils/network');
const { getOSInfo } = require('../utils/device');

class SystemEvent {
  constructor() {
    this.networkInterval = null;
    this.pingInterval = null;
  }

  start() {
    this.emitNetworkInfo();
    this.emitPingInfo();

    this.networkInterval = setInterval(() => this.emitNetworkInfo(), 5000);
    this.pingInterval = setInterval(() => this.emitPingInfo(), 1000);
  }

  stop() {
    clearInterval(this.networkInterval);
    clearInterval(this.pingInterval);
  }

  emitNetworkInfo() {
    getNetworkInfo().then((info) => {
      this.broadcast('network-status-update', info);
      console.log('Network Info:', info);
    });
  }

  emitPingInfo() {
    getPingInfo().then((info) => {
      this.broadcast('ping-update', info);
      console.log('Ping Info:', info);
    });
  }

  emitDeviceInfo() {
    const info = getOSInfo();
    this.broadcast('device-info', info);
    console.log('Device Info:', info);
  }

  broadcast(channel, payload) {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(channel, payload);
    });
  }
}

module.exports = SystemEvent;