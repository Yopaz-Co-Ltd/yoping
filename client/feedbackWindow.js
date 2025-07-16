const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createFeedbackWindow() {
  const win = new BrowserWindow({
    width: 670,
    height: 400,
    resizable: false,
    show: true
  });
  win.loadFile(path.join(__dirname, 'screen/feedback.html'));
}

ipcMain.on('open-feedback-window', () => {
  createFeedbackWindow();
});

module.exports = { createFeedbackWindow };
