console.log('Hello from Electron 👋')

const { app, BrowserWindow } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'screen/dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
})
