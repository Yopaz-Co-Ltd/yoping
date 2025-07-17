console.log('Hello from Electron 👋')

const { app, BrowserWindow, Tray, Menu, screen, ipcMain, Notification } = require('electron')
const path = require('path')
const { createFeedbackWindow } = require('./feedbackWindow')
const { getNetwordInfo } = require('./utils/network');

let tray = null
let win = null

const NOTIFICATION_TITLE = 'Mất kết nối mạng';
const NOTIFICATION_BODY = 'Vui lòng kiểm tra kết nối Internet.';

function showNotification() {
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


      win.on('blur', () => {
        win.hide()
      })

      win.once('ready-to-show', () => {
        const primaryDisplay = screen.getPrimaryDisplay()
        const displayBounds = primaryDisplay.bounds
        const workArea = primaryDisplay.workArea

        const windowBounds = win.getBounds()
        const x = displayBounds.x + displayBounds.width - windowBounds.width - 10

        let y
        const taskbarHeight = displayBounds.height - workArea.height
        const taskbarAtTop = workArea.y > displayBounds.y

        if (taskbarHeight > 0) {
          if (taskbarAtTop) {
            y = workArea.y + 10
          } else {
            y = workArea.y + workArea.height - windowBounds.height - 10
          }
        } else {
          y = displayBounds.y + displayBounds.height - windowBounds.height - 10
        }

        win.webContents.on('did-finish-load', () => {
          win.webContents.send('platform-info', process.platform);
        });
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
