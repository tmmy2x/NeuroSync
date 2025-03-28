// tray.js
const { Tray, Menu, app } = require('electron');
const path = require('path');
const {
  startFocusSession,
  endFocusSession,
  isFocusActive
} = require('./focusSessionManager');
const {
  startTimer,
  stopTimer,
  setDuration,
  getRemainingTime
} = require('./timerManager');
const { getSessionHistory } = require('./sessionHistory');

let tray;
let timerInterval;

function createTray() {
  tray = new Tray(path.join(__dirname, 'iconTemplate.png')); // Add a small 16x16 PNG icon
  updateTrayMenu();

  setInterval(() => {
    if (isFocusActive()) updateTrayMenu();
  }, 10000);
}

function updateTrayMenu() {
  const minutesLeft = Math.floor(getRemainingTime() / 60);
  const seconds = getRemainingTime() % 60;
  const label = isFocusActive()
    ? `Focus: ${minutesLeft}m ${seconds}s left`
    : 'Focus Bubble is off';

  const contextMenu = Menu.buildFromTemplate([
    { label, enabled: false },
    {
        label: '🧠 Session History',
        click: () => {
          const history = getSessionHistory();
          console.log("🗂 Session History:\n", history);
        }
      },
    {
      label: isFocusActive() ? 'End Focus Session' : 'Start Focus Session',
      click: () => {
        if (isFocusActive()) {
          stopTimer();
          endFocusSession();
        } else {
          setDuration(25); // You can change to user-defined later
          startFocusSession();
          startTimer(() => updateTrayMenu(), () => {
            tray.displayBalloon({
              title: 'Focus Session Complete',
              content: 'You crushed it! Time to rest 🧘‍♂️',
            });
          });
        }
        updateTrayMenu();
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('Focus Bubble');
  tray.setContextMenu(contextMenu);
}

module.exports = { createTray };
