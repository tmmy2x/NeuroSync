// timerManager.js
const { endFocusSession } = require('./focusSessionManager');

let intervalId = null;
let remainingTime = 25 * 60; // 25 minutes default

function startTimer(onTick, onEnd) {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    remainingTime--;

    if (onTick) onTick(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      endFocusSession();
      if (onEnd) onEnd();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function setDuration(minutes) {
  remainingTime = minutes * 60;
}

function getRemainingTime() {
  return remainingTime;
}

module.exports = {
  startTimer,
  stopTimer,
  setDuration,
  getRemainingTime
};
