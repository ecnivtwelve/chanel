const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

// chanel config
const config = require('./config.json');

try {
	require('electron-reloader')(module);
} catch {}

let webPrefs = {};

if(config.appSettings.useNode) {
    webPrefs = {
        nodeIntegration: true,
        contextIsolation: false
    }
}

let iconPath = path.join(__dirname, './build/icon.png')

if(config.appIcon !== undefined && config.appIcon !== null && config.appIcon !== '') {
  iconPath = path.join(__dirname, config.appIcon);
}

// electron
let win;

function createWindow () {
  win = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    title: config.appName,
    frame: false,
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: webPrefs
  })

  win.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('close', () => {
  app.quit()
});

ipcMain.on('minimize', () => {
  win.minimize()
});

ipcMain.on('maximize', () => {
  if(win.isMaximized()) {
    win.unmaximize()
  }
  else {
    win.maximize()
  }
});