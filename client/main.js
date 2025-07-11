console.log('Hello from Electron 👋')

const { app, BrowserWindow, Tray, Menu, screen } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

let tray = null
let win = null

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
      const tailHeight = 10
      win = new BrowserWindow({
        width: 375,
        height: 420 + tailHeight,
        show: false,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: true
        }
      })
      if (isDev) {
        win.loadURL('http://localhost:5173')
      } else {
        win.loadFile(path.join(__dirname, 'screen/dist/index.html'))
      }

      win.on('blur', () => {
        win.hide()
      })

      win.once('ready-to-show', () => {
        const trayBounds = tray.getBounds()
        const primaryDisplay = screen.getPrimaryDisplay()
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (375 / 2))
        const y = Math.round(trayBounds.y + trayBounds.height + 4 + tailHeight)
        win.setPosition(x, y)
        win.show()
      })
    }
  })
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
  createTray()
})
