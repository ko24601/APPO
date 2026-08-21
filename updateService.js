// Robust Update Service for Electron app
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { ipcMain } = require('electron');

// Configure logging
log.transports.file.level = 'info';
log.transports.console.level = 'warn'; // Avoid verbose console spam
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Configure GitHub provider for updates
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'ko24601',
  repo: 'APPO',
  private: false
});

// Allow prerelease updates to avoid using the broken website endpoint for tag lookup
autoUpdater.allowPrerelease = true;

let mainWindowRef = null;
let updateStatus = {
  status: 'idle', // 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  info: null,
  progress: null,
  error: null
};

let retryCount = 0;
const MAX_RETRIES = 3;

function sendStatusToWindow(status, data = {}) {
  updateStatus = { ...updateStatus, status, ...data };
  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    try {
      mainWindowRef.webContents.send('update-status-changed', updateStatus);
    } catch (e) {
      // Window might be closing
    }
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
  });

  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('not-available', { info, error: null });
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
  });

  autoUpdater.on('error', (err) => {
    // Log detailed error for debugging
    log.error('Update check failed:', err);

    // Safe friendly error capture without throwing unhandled exceptions
    const friendlyMsg = err?.message?.includes('404')
      ? 'No published update package found on GitHub Releases yet.'
      : (err ? err.message : 'Update check encountered a network error.');

    sendStatusToWindow('error', { error: friendlyMsg });
  });

  // IPC handlers from renderer
  ipcMain.handle('check-for-updates', async () => {
    try {
      sendStatusToWindow('checking');
      retryCount = 0; // Reset on attempt
      const result = await autoUpdater.checkForUpdates();
      return { success: true, result };
    } catch (err) {
      // Only show user error after max retries
      if (retryCount >= MAX_RETRIES) {
        const friendlyMsg = err?.message?.includes('404')
          ? 'No published update package found on GitHub Releases yet.'
          : (err ? err.message : 'Updater error');
        sendStatusToWindow('error', { error: friendlyMsg });
        return { success: false, error: friendlyMsg };
      }

      // Otherwise, retry briefly
      retryCount++;
      setTimeout(() => {
        // Trigger another check after short delay
        autoUpdater.checkForUpdates().catch(() => {});
      }, 2000);

      return { success: false, retrying: true };
    }
  });

  ipcMain.handle('get-update-status', () => {
    return updateStatus;
  });

  ipcMain.handle('quit-and-install-update', () => {
    try {
      setImmediate(() => {
        autoUpdater.quitAndInstall(false, true);
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  // Safe background check on launch
  if (process.env.NODE_ENV !== 'development') {
    setTimeout(() => {
      try {
        autoUpdater.checkForUpdates().catch(() => {});
      } catch (e) {}
    }, 5000);
  }
}

module.exports = {
  initUpdateService,
  checkForUpdates: () => {
    try {
      return autoUpdater.checkForUpdates().catch(() => {});
    } catch (e) {}
  }
};