const { contextBridge, ipcRenderer } = require('electron');
const packageJson = require('./package.json');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  appVersion: packageJson.version,
  platform: process.platform,
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getUpdateStatus: () => ipcRenderer.invoke('get-update-status'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install-update'),
  onUpdateStatusChanged: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('update-status-changed', subscription);
    return () => ipcRenderer.removeListener('update-status-changed', subscription);
  }
});