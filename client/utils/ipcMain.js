const { ipcMain, Menu, BrowserWindow, app } = require('electron');
const path = require('path');
const { getOSInfo } = require('./device');

function setupContextMenu() {
    ipcMain.on('show-context-menu', (event) => {
        const menu = Menu.buildFromTemplate([
            {
                label: 'Gửi phản hồi',
                click: () => createFeedbackWindow()
            },
            {
                label: 'Thoát',
                click: () => app.quit()
            }
        ]);

        const win = BrowserWindow.fromWebContents(event.sender);
        menu.popup({ window: win });
    });
}

function createFeedbackWindow() {
    const isMac = process.platform === 'darwin';
    const windowHeight = isMac ? 400 : 412;
    const win = new BrowserWindow({
        width: 670,
        height: windowHeight,
        resizable: false,
        show: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile(path.join(__dirname, './../screen/feedback.html'));
}

const setUpIpcMain = () => {
    setupContextMenu();    

    ipcMain.handle('get-device-info', () => {
        return getOSInfo();
    });

    ipcMain.on('open-feedback-window', () => {
        createFeedbackWindow();
    });
}

module.exports = { setUpIpcMain };