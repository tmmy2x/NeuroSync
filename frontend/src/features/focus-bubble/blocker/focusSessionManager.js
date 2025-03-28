// focusSessionManager.js
let isFocusMode = false;
let sessionStart = null;
let expectedDuration = 25 * 60;
let currentTag = '';
let distractionCount = 0;

const { logSession } = require('./sessionHistory');
const { addXP } = require('./xpTracker');
const { BrowserWindow } = require('electron');
const { unlockThemeForLevel } = require('./themeUnlocker');

function startFocusSession(tag = 'untagged', durationInMinutes = 25) {
  isFocusMode = true;
  sessionStart = new Date();
  expectedDuration = durationInMinutes * 60;
  distractionCount = 0;
  currentTag = tag;
  console.log(`🔒 Focus started: [${tag}] for ${durationInMinutes} min`);
}

function incrementDistraction() {
    distractionCount++;
  }
  
  function resetDistractions() {
    distractionCount = 0;
  }
  
  function getDistractionCount() {
    return distractionCount;
  }

function getExpectedDuration() {
    return expectedDuration;
  }

  const { addXP } = require('./xpTracker');

  function endFocusSession() {
    if (isFocusMode && sessionStart) {
      const sessionEnd = new Date();
      const actualDuration = Math.round((sessionEnd - sessionStart) / 1000);
      const completed = actualDuration >= expectedDuration - 5;
      const win = BrowserWindow.getAllWindows()[0]; // assuming single window

if (completed) {
  const { leveledUp, level } = addXP(50);
  if (leveledUp) {
    win.webContents.send('level-up', level);
  }
}
  
      logSession({
        start: sessionStart.toISOString(),
        end: sessionEnd.toISOString(),
        duration: actualDuration,
        completed,
        tag: currentTag,
        distractions: distractionCount
      });
  
      // 💥 XP Rewards
      if (completed) addXP(50); // Base XP
      if (distractionCount === 0) addXP(20); // Bonus for no distractions
      if (expectedDuration >= 50 * 60) addXP(30); // Long session bonus
    }
  
    isFocusMode = false;
    sessionStart = null;
    expectedDuration = 0;
    currentTag = '';
    distractionCount = 0;
    console.log("🔓 Focus ended.");
  }  

function isFocusActive() {
  return isFocusMode;
}
if (leveledUp) {
    const theme = unlockThemeForLevel(level);
    if (theme) {
      win.webContents.send('level-up', level); // already there
      win.webContents.send('theme-unlocked', theme);
    }
  }

module.exports = {
  startFocusSession,
  endFocusSession,
  isFocusActive
};



