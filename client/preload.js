const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  getConnectionType: () => ipcRenderer.invoke('get-connection-type'),
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info'),
  onNetworkStatusUpdate: (callback) => ipcRenderer.on('network-status-update', (_event, value) => callback(value)),
  onPingUpdate: (callback) => ipcRenderer.on('ping-update', (_event, value) => callback(value))
});

console.log('✅ preload script loaded');
