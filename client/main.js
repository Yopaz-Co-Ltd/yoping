console.log('Hello from Electron 👋')

const { app, BrowserWindow, Tray, Menu, screen, ipcMain, Notification } = require('electron')
const path = require('path')
const { createFeedbackWindow } = require('./feedbackWindow')
const { getNetwordInfo } = require('./utils/network');

let tray = null
let win = null

const NOTIFICATION_TITLE = 'Mất kết nối mạng';
const NOTIFICATION_BODY = 'Vui lòng kiểm tra kết nối Internet.';

function showNotification () {
  const notification = new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  });

  notification.show();
}

const getOSInfo = () => {
  let osName;

  switch (process.platform) {
    case 'darwin': // macOS
      osName = 'mac';
      break;
    case 'win32': // Windows
      osName = 'windows';
      break;
    case 'linux': // Linux
      osName = 'linux';
      break;
    default:
      osName = 'unknown';
  }
  return {
    device: {
      os: osName
    }
  };
};


const createTray = () => {
  tray = new Tray(path.join(__dirname, 'yopingTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Quit', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Yoping App')
  tray.on('click', () => {
    if (win) {
      win.isVisible() ? win.hide() : win.show()
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
          preload: path.join(__dirname, './preload.js')
        }
      })
      win.loadFile(path.join(__dirname, 'screen/index.html'))
      // win.webContents.openDevTools({mode: 'detach'})

      win.on('blur', () => {
        win.hide()
      })

      win.once('ready-to-show', () => {
        const trayBounds = tray.getBounds()
        const primaryDisplay = screen.getPrimaryDisplay()
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (375 / 2))
        const y = Math.round(trayBounds.y + trayBounds.height + 4)
        win.setPosition(x, y)
        win.show()
      })
    }
  })
}

ipcMain.on('show-context-menu', (event) => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Gửi phản hồi',
      click: () => createFeedbackWindow()
    },
    { label: 'Thoát', click: () => app.quit() }
  ])
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup({ window: win })
})

const handleNetworkStatus = () => {
  sendNetworkInfo();

  setInterval(() => {
    sendNetworkInfo();
  }, 5000);
};

const sendNetworkInfo = () => {
  getNetwordInfo().then(async (value) => {
    console.log('Network info:', value);
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('network-status-update', value);
    });
  });
};

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
  
  ipcMain.handle('get-device-info', () => {
    return getOSInfo();
  });

  handleNetworkStatus();

  createTray();
})
