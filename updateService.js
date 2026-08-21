// Update service stub - auto-updater functionality removed as requested
// This file exists only to maintain imports but provides no update functionality

// Stub functions that do nothing
function initUpdateService(mainWindow) {
  // Auto-updater disabled as requested - mainWindow parameter unused intentionally
}

function checkForUpdates() {
  // Return a resolved promise with no result - updates disabled
  return Promise.resolve(null);
}

module.exports = {
  initUpdateService,
  checkForUpdates
};