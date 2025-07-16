const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  getConnectionType: () => ipcRenderer.invoke('get-connection-type'),
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info'),
  getNetWorkInfo: () => ipcRenderer.send('get-network-info'),
  onNetworkStatusUpdate: (callback) => ipcRenderer.on('network-status-update', (_event, value) => callback(value)),
});

console.log('✅ preload script loaded');
