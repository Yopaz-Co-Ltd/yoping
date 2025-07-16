const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info'),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  getNetWorkInfo: () => ipcRenderer.send('get-network-info'),
  onNetworkStatusUpdate: (callback) => ipcRenderer.on('network-status-update', (_event, status) => callback(status))
});

console.log('✅ preload script loaded');
