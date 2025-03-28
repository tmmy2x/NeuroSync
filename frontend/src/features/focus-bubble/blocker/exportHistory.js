// exportHistory.js
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { getSessionHistory } = require('./sessionHistory');
const { createObjectCsvWriter } = require('csv-writer');

async function exportSessionHistory() {
  const history = getSessionHistory();

  if (!history || history.length === 0) {
    console.log('⚠️ No session history to export.');
    return;
  }

  const defaultPath = path.join(
    require('os').homedir(),
    `focus-history-${new Date().toISOString().slice(0, 10)}.csv`
  );

  const { filePath } = await dialog.showSaveDialog({
    defaultPath,
    filters: [{ name: 'CSV File', extensions: ['csv'] }]
  });

  if (!filePath) return;

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'start', title: 'Start' },
      { id: 'end', title: 'End' },
      { id: 'duration', title: 'Duration (sec)' },
      { id: 'tag', title: 'Tag' },
      { id: 'completed', title: 'Completed' },
      { id: 'distractions', title: 'Distractions' },
      { id: 'timestamp', title: 'Logged At' }
    ]
  });

  await csvWriter.writeRecords(history);
  console.log(`✅ Focus session history exported to: ${filePath}`);
}

module.exports = { exportSessionHistory };
