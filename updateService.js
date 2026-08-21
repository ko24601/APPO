// Update service for Electron app with electron-updater and IPC communication
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { ipcMain, dialog } = require('electron');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindowRef = null;
let updateStatus = {
  status: 'idle', // 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  info: null,
  progress: null,
  error: null
};

function sendStatusToWindow(status, data = {}) {
  updateStatus = { ...updateStatus, status, ...data };
  log.info('Update status:', status, data);
  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    mainWindowRef.webContents.send('update-status-changed', updateStatus);
  }
}

function initUpdateService(mainWindow) {
  mainWindowRef = mainWindow;

  // AutoUpdater Event Listeners
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('checking');
  });

  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('available', { info, error: null });
    log.info('Update available:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('not-available', { info, error: null });
    log.info('Update not available:', info);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow('downloading', {
      progress: {
        percent: Math.round(progressObj.percent || 0),
        bytesPerSecond: progressObj.bytesPerSecond,
        transferred: progressObj.transferred,
        total: progressObj.total
      }
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('downloaded', { info });
    log.info('Update downloaded, ready to install');
  });

  autoUpdater.on('error', (err) => {
    sendStatusToWindow('error', { error: err ? err.message : 'Unknown updater error' });
    log.error('Error in auto-updater: ', err);
  });

  // IPC handlers from renderer
  ipcMain.handle('check-for-updates', async () => {
    try {
      sendStatusToWindow('checking');
      const result = await autoUpdater.checkForUpdates();
      return { success: true, result };
    } catch (err) {
      sendStatusToWindow('error', { error: err.message });
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-update-status', () => {
    return updateStatus;
  });

  ipcMain.handle('quit-and-install-update', () => {
    log.info('quit-and-install requested from renderer');
    setImmediate(() => {
      autoUpdater.quitAndInstall(false, true);
    });
    return { success: true };
  });

  // Check immediately on launch in production
  if (process.env.NODE_ENV !== 'development') {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(err => {
        log.warn('Initial update check error:', err.message);
      });
    }, 4000);
  }
}

module.exports = {
  initUpdateService,
  checkForUpdates: () => autoUpdater.checkForUpdates().catch(err => log.error(err))
};