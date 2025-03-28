// dashboard.js
const { getSessionHistory } = require('./sessionHistory');

function getDashboardStats() {
  const sessions = getSessionHistory();

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalFocusSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const averageDuration = totalSessions ? totalFocusSeconds / totalSessions : 0;
  const completionRate = totalSessions ? (completedSessions / totalSessions) * 100 : 0;

  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.start.startsWith(today));
  const todayFocus = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  const uniqueDays = new Set(sessions.map(s => s.start.slice(0, 10)));
  const streak = calculateStreak(uniqueDays);

  return {
    totalSessions,
    completedSessions,
    completionRate: completionRate.toFixed(1),
    totalFocusMinutes: Math.round(totalFocusSeconds / 60),
    averageDurationMinutes: Math.round(averageDuration / 60),
    todayFocusMinutes: Math.round(todayFocus / 60),
    streak
  };
}

function calculateStreak(uniqueDays) {
  const sorted = Array.from(uniqueDays).sort().reverse();
  let streak = 0;
  let expected = new Date();

  for (const day of sorted) {
    const check = day === expected.toISOString().slice(0, 10);
    if (check) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getLast7DaysFocusData() {
    const sessions = getSessionHistory();
  
    const data = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      data[key] = 0;
    }
  
    for (const session of sessions) {
      const day = session.start.slice(0, 10);
      if (data[day] !== undefined) {
        data[day] += Math.round(session.duration / 60); // minutes
      }
    }
  
    return data;
  }
  
  module.exports = {
    getDashboardStats,
    getLast7DaysFocusData
  };
  


