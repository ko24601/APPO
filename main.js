const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');
const { initUpdateService } = require('./updateService');

let mainWindow = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#08090C',
    title: 'F1 Pit Wall Command Center',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true
    }
  });

  // Remove default menu for sleek cockpit feel
  Menu.setApplicationMenu(null);

  // Load the React app
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Initialize auto-updater service with main window
  initUpdateService(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});