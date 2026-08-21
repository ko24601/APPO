// Simple update service for Electron app
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { dialog } = require('electron');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.checkForUpdatesAndNotify();

module.exports = {
  checkForUpdates: () => {
    return new Promise((resolve, reject) => {
      autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Update Available',
          message: 'A new version is available. Do you want to update now?',
          buttons: ['Update', 'Later']
        }).then(result => {
          if (result.response === 0) { // Update button clicked
            autoUpdater.downloadUpdate();
          } else {
            resolve();
          }
        });
      });

      autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
          title: 'Update Ready',
          message: 'Update downloaded. Application will restart for update.',
          buttons: ['Restart']
        }).then(() => {
          setImmediate(() => autoUpdater.quitAndInstall());
        });
      });

      autoUpdater.on('error', (err) => {
        log.error('Error in auto-updater: ', err);
        reject(err);
      });

      // Check for updates
      autoUpdater.checkForUpdates();
    });
  }
};