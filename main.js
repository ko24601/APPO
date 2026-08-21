const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { checkForUpdates } = require('./updateService');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the React app
  win.loadFile('dist/index.html');
}

app.whenReady().then(async () => {
  createWindow();

  // Check for updates
  await checkForUpdates();

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