const { Tray, Menu, BrowserWindow, screen, nativeTheme } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createTray() {
  const isDarkMode = nativeTheme.shouldUseDarkColors;
  const trayIcon = isDarkMode
    ? path.join(__dirname, '../public/images/yoping-light.png')
    : path.join(__dirname, '../public/images/yoping-dark.png');
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Yoping App');

  nativeTheme.on('updated', () => {
    const isDark = nativeTheme.shouldUseDarkColors;
    const updatedIcon = isDark
      ? path.join(__dirname, '../public/images/yoping-light.png')
      : path.join(__dirname, '../public/images/yoping-dark.png');
    tray.setImage(updatedIcon);
  });

  tray.on('click', (_event, bounds) => {
    if (win) {
      win.isVisible() ? win.hide() : win.show();
    } else {
      win = new BrowserWindow({
        width: 375,
        height: 465,
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

      // win.on('blur', () => win.hide());

      win.once('ready-to-show', () => {
        showWindow(bounds);
        win.webContents.on('did-finish-load', () => {
          win.webContents.send('platform-info', process.platform);
        });
      });
    }
  });

  return tray;
}

function showWindow(trayBounds) {
  const platform = process.platform;
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const displayBounds = display.bounds;
  const workArea = display.workArea;

  const windowBounds = win.getBounds();
  let x = 0;
  let y = 0;

  if (platform === 'darwin') {
    const trayX = trayBounds.x;
    const trayY = trayBounds.y;
    const trayWidth = trayBounds.width;

    x = Math.round(trayX + trayWidth / 2 - windowBounds.width / 2);
    y = Math.round(trayY + trayBounds.height + 4);

  } else if (platform === 'win32') {
    x = displayBounds.x + displayBounds.width - windowBounds.width - 10;

    const taskbarHeight = displayBounds.height - workArea.height;
    const taskbarAtTop = workArea.y > displayBounds.y;

    if (taskbarHeight > 0) {
      if (taskbarAtTop) {
        y = workArea.y + 10;
      } else {
        y = workArea.y + workArea.height - windowBounds.height - 10;
      }
    } else {
      y = displayBounds.y + displayBounds.height - windowBounds.height - 10;
    }
  }

  console.log("SET POSITION: ", x, y);
  
  win.setPosition(x, y, false);
  win.show();
  win.focus();
}

module.exports = { createTray };