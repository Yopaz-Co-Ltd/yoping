const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info')
});