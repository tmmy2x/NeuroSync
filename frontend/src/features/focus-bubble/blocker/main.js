// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { startFocusSession, endFocusSession } = require('./focusSessionManager');
const { setupBlocking } = require('./siteBlocker');
const { createTray } = require('./tray');
const { ipcMain } = require('electron');
const { getSessionHistory } = require('./sessionHistory');
const { setDuration } = require('./timerManager');
const { startTimer } = require('./timerManager');
const { exportSessionHistory } = require('./exportHistory');
const { getDashboardStats } = require('./dashboard');
const { getLast7DaysFocusData } = require('./dashboard');
const { checkAndBlockApps } = require('./appBlocker');
const { getBlockedApps, updateBlockedApps } = require('./appBlocker');
const { getXPData } = require('./xpTracker');
const {
    getThemeData,
    unlockTheme,
    setDefaultTheme
  } = require('./themeManager');



let win;
let appBlockerInterval = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: require('path').join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  setupBlocking();
  createWindow();
  createTray(); // 👈 Load tray + timer

  ipcMain.on('start-focus', startFocusSession);
  ipcMain.on('end-focus', endFocusSession);
  ipcMain.handle('get-session-history', async () => {
    return getSessionHistory();
  });
  ipcMain.on('start-focus', (event, { tag, duration }) => {
    setDuration(duration);
    startFocusSession(tag, duration);
    startTimer(() => updateTrayMenu(), () => {
      tray.displayBalloon({
        title: 'Focus Complete',
        content: `Session "${tag}" ended. Well done!`
      });
    });
  });
  ipcMain.handle('export-session-history', async () => {
    await exportSessionHistory();
  });
  ipcMain.handle('get-dashboard-stats', () => {
    return getDashboardStats();
  });
  ipcMain.handle('get-focus-chart-data', () => {
    return getLast7DaysFocusData();
  });
  ipcMain.on('start-focus', (event, { tag, duration }) => {
    setDuration(duration);
    startFocusSession(tag, duration);
    startTimer(() => updateTrayMenu(), () => {
      tray.displayBalloon({
        title: 'Focus Complete',
        content: `Session "${tag}" complete!`
      });
      clearInterval(appBlockerInterval);
    });
  
    appBlockerInterval = setInterval(() => {
      checkAndBlockApps();
    }, 10000); // Check every 10 seconds
  });
  
  ipcMain.on('end-focus', () => {
    endFocusSession();
    clearInterval(appBlockerInterval);
  });
  ipcMain.handle('get-blocked-apps', () => getBlockedApps());
ipcMain.handle('update-blocked-apps', (event, newList) => {
  updateBlockedApps(newList);
});
ipcMain.handle('get-xp-data', () => getXPData());
ipcMain.handle('add-xp', (event, amount) => {
    const result = addXP(amount);
    return result;
  });
  ipcMain.handle('get-theme-data', () => getThemeData());
ipcMain.handle('set-default-theme', (event, theme) => setDefaultTheme(theme));
ipcMain.handle('unlock-theme', (event, theme) => unlockTheme(theme));
  
});