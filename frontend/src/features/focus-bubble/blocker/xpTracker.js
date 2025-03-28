// xpTracker.js
const Store = require('electron-store');
const store = new Store();

function getXPData() {
  return store.get('xpData') || { totalXP: 0, level: 1 };
}

function addXP(amount) {
    const xpData = getXPData();
    const oldLevel = xpData.level;
  
    xpData.totalXP += amount;
    xpData.level = Math.floor(xpData.totalXP / 100) + 1;
  
    store.set('xpData', xpData);
  
    return {
      ...xpData,
      leveledUp: xpData.level > oldLevel
    };
  }
  

function resetXP() {
  store.set('xpData', { totalXP: 0, level: 1 });
}

module.exports = {
  getXPData,
  addXP,
  resetXP
};
