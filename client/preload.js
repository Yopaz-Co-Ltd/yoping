const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info'),
  showContextMenu: () => ipcRenderer.send('show-context-menu')
});

console.log('✅ preload script loaded');
