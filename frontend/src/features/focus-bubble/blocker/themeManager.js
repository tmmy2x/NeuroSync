// themeManager.js
const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, 'data', 'unlockedThemes.json');

function getThemeData() {
  try {
    return JSON.parse(fs.readFileSync(THEME_FILE));
  } catch {
    return { default: 'calm', unlocked: ['calm'] };
  }
}

function unlockTheme(theme) {
  const data = getThemeData();
  if (!data.unlocked.includes(theme)) {
    data.unlocked.push(theme);
    fs.writeFileSync(THEME_FILE, JSON.stringify(data, null, 2));
  }
}

function setDefaultTheme(theme) {
  const data = getThemeData();
  if (data.unlocked.includes(theme)) {
    data.default = theme;
    fs.writeFileSync(THEME_FILE, JSON.stringify(data, null, 2));
  }
}

module.exports = {
  getThemeData,
  unlockTheme,
  setDefaultTheme
};
