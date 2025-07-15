const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.more-icon');
  if (btn) {
    btn.addEventListener('click', () => {
      ipcRenderer.send('open-feedback-window');
    });
  }
});
