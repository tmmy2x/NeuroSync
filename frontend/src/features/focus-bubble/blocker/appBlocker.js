// appBlocker.js
const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { isFocusActive, incrementDistraction } = require('./focusSessionManager');
const dataPath = path.join(__dirname, 'data', 'blockedApps.json');

const blockedApps = [
  'Discord',       // Common distractions
  'Slack',
  'Steam',
  'Telegram',
  'Spotify'
];

function getPlatformCommand(appName) {
  const platform = os.platform();

  if (platform === 'darwin') {
    return `osascript -e 'tell application "${appName}" to quit'`;
  }

  if (platform === 'win32') {
    return `taskkill /F /IM ${appName}.exe`;
  }

  return null;
}

function getBlockedApps() {
    const dataPath = path.join(__dirname, 'blockedApps.json');
    try {
      const data = fs.readFileSync(dataPath, 'utf-8');
      return JSON.parse(data).apps || [];
    } catch (err) {
      console.error("❌ Failed to read blocked apps list:", err);
      return [];
    }
  }
  
  function updateBlockedApps(apps) {
    const dataPath = path.join(__dirname, 'blockedApps.json');
    fs.writeFileSync(dataPath, JSON.stringify({ apps }, null, 2));
  }
  
  function getPlatformCommand(appName) {
    const platform = os.platform();
  
    if (platform === 'darwin') {
      return `osascript -e 'tell application "${appName}" to quit'`;
    }
  
    if (platform === 'win32') {
      return `taskkill /F /IM ${appName}.exe`;
    }
  
    return null;
  }
  
  function checkAndBlockApps() {
    if (!isFocusActive()) return;
  
    const apps = getBlockedApps();
    apps.forEach(app => {
      const cmd = getPlatformCommand(app);
      if (cmd) {
        exec(cmd, (error) => {
          if (!error) {
            console.log(`🚫 Blocked app: ${app}`);
            incrementDistraction();
          }
        });
      }
    });
  }
  
  module.exports = {
    checkAndBlockApps,
    getBlockedApps,
    updateBlockedApps
  };
