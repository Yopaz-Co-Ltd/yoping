const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    openFeedback: () => ipcRenderer.send('open-feedback-window')
});
console.log('✅ preload script loaded');