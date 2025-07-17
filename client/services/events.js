const { BrowserWindow } = require('electron');
const { getNetworkInfo, getPingToDefaultGateway, getPingToDomestic, getPingToInternational, getPingToPublicIP } = require('../utils/network');

class SystemEvent {
  constructor() {
    this.networkInterval = null;
    this.pingInterval = null;
  }

  start() {
    this.emitNetworkInfo();
    this.emitPingDefaultGatewayInfo();
    this.emitPingPublicIPInfo();
    this.emitPingDomesticInfo();
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

  emitNetworkInfo() {
    getNetworkInfo().then((info) => {
      this.broadcast('network-status-update', info);
      console.log('Network Info:', info);
    });
  }

  emitPingDefaultGatewayInfo() {
    getPingToDefaultGateway().then((info) => {
      this.broadcast('ping-default-gateway', info);
      console.log('Ping Default Gateway Info:', info);
    });
  }

  emitPingDomesticInfo() {
    getPingToDomestic().then((info) => {
      this.broadcast('ping-domestic', info);
      console.log('Ping Domestic Info:', info);
    });
  }

  emitPingInternationalInfo() {
    getPingToInternational().then((info) => {
      this.broadcast('ping-international', info);
      console.log('Ping International Info:', info);
    });
  }

  emitPingPublicIPInfo() {
    getPingToPublicIP().then((info) => {
      this.broadcast('ping-public-ip', info);
      console.log('Ping Public IP Info:', info);
    });
  }


  broadcast(channel, payload) {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(channel, payload);
    });
  }
}

module.exports = SystemEvent;