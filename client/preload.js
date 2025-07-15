const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFeedback: () => ipcRenderer.send('open-feedback-window'),
  showContextMenu: () => ipcRenderer.send('show-context-menu')
});

console.log('✅ preload script loaded');