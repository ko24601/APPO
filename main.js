const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');
const { initUpdateService } = require('./updateService');

// Global error handlers: prevent any unhandled error from showing red crash screens
process.on('uncaughtException', (err) => {
  console.warn('Caught uncaughtException in main process:', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.warn('Caught unhandledRejection in main process:', reason?.message || reason);
});

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

  // Initialize auto-updater service safely
  try {
    initUpdateService(mainWindow);
  } catch (e) {
    console.warn('Failed to init update service:', e);
  }

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