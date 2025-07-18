const { app } = require('electron')
const SystemEvent = require('./services/events')
const { createTray } = require('./utils/setup')
const { setUpIpcMain } = require('./utils/ipcMain')
const { getDeviceUUID } = require('./utils/uuid')
const systemEvent = new SystemEvent();

setUpIpcMain();

const init = () => {
  systemEvent.start();
  getDeviceUUID();
};

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  init();

  createTray();
})
