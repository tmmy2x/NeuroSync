// themeUnlocker.js
const { applyTheme } = require('../moodmorph/themeController'); // adjust path if needed

function unlockThemeForLevel(level) {
  const unlocks = {
    2: 'calm',
    3: 'power',
    5: 'night',
    7: 'dynamic'
  };

  if (unlocks[level]) {
    applyTheme(unlocks[level]);
    return unlocks[level];
  }

  return null;
}

module.exports = { unlockThemeForLevel };
