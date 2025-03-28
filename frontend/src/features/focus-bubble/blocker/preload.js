// preload.js
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('focusAPI', {
    startFocus: (data) => ipcRenderer.send('start-focus', data),
    endFocus: () => ipcRenderer.send('end-focus'),
    requestSessionHistory: () => ipcRenderer.invoke('get-session-history'),
    exportSessionHistory: () => ipcRenderer.invoke('export-session-history'),
    getFocusChartData: () => ipcRenderer.invoke('get-focus-chart-data'),
    getBlockedApps: () => ipcRenderer.invoke('get-blocked-apps'),
    updateBlockedApps: (apps) => ipcRenderer.invoke('update-blocked-apps', apps),
    getXPData: () => ipcRenderer.invoke('get-xp-data'),
    addXP: (amount) => ipcRenderer.invoke('add-xp', amount),
    getThemeData: () => ipcRenderer.invoke('get-theme-data'),
    setDefaultTheme: (theme) => ipcRenderer.invoke('set-default-theme', theme),
    getDashboardStats: () => ipcRenderer.invoke('get-dashboard-stats') // ✅
  });
  
  contextBridge.exposeInMainWorld('moodMorphAPI', {
    applyTheme: (theme) => {
      document.body.setAttribute('data-theme', theme); // OR whatever MoodMorph uses
    }
  });
  
  
