const { Tray, Menu, BrowserWindow, screen } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/images/yoping.png'));

  const contextMenu = Menu.buildFromTemplate([]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Yoping App');

  tray.on('click', () => {
    if (win) {
      win.isVisible() ? win.hide() : win.show();
    } else {
      win = new BrowserWindow({
        width: 375,
        height: 440,
        show: false,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
          preload: path.join(__dirname, '../preload.js')
        }
      });

      win.loadFile(path.join(__dirname, '../screen/index.html'));
      // win.webContents.openDevTools({ mode: 'detach' });

      win.on('blur', () => win.hide());

      win.once('ready-to-show', () => {
        const primaryDisplay = screen.getPrimaryDisplay();
        const displayBounds = primaryDisplay.bounds;
        const workArea = primaryDisplay.workArea;

        const windowBounds = win.getBounds();
        const x = displayBounds.x + displayBounds.width - windowBounds.width - 10;

        let y;
        const taskbarHeight = displayBounds.height - workArea.height;
        const taskbarAtTop = workArea.y > displayBounds.y;

        y = taskbarHeight > 0
          ? (taskbarAtTop ? workArea.y + 10 : workArea.y + workArea.height - windowBounds.height - 10)
          : displayBounds.y + displayBounds.height - windowBounds.height - 10;

        win.webContents.on('did-finish-load', () => {
          win.webContents.send('platform-info', process.platform);
        });

        win.setPosition(x, y);
        win.show();
      });
    }
  });

  return tray;
}

module.exports = { createTray };