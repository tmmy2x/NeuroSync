// sessionHistory.js
const Store = require('electron-store');
const store = new Store();

function logSession({ start, end, duration, completed, tag }) {
  const session = {
    start,
    end,
    duration,
    completed,
    tag,
    distractions,
    timestamp: new Date().toISOString()
  };

  const history = store.get('focusSessions') || [];
  history.push(session);
  store.set('focusSessions', history);
}

function getSessionHistory() {
  return store.get('focusSessions') || [];
}

function clearSessionHistory() {
  store.set('focusSessions', []);
}

module.exports = { logSession, getSessionHistory, clearSessionHistory };
