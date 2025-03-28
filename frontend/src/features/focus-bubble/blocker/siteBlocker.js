// siteBlocker.js
const { session } = require('electron');
const fs = require('fs');
const path = require('path');
const { isFocusActive } = require('./focusSessionManager');
const { Notification } = require('electron');
const { incrementDistraction } = require('./focusSessionManager');


function getBlocklist() {
  const data = fs.readFileSync(path.join(__dirname, 'blocklist.json'));
  const { default: defaults, custom } = JSON.parse(data);
  return [...defaults, ...custom];
}

function setupBlocking() {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (!isFocusActive()) return callback({ cancel: false });

    const url = details.url;
    const blocklist = getBlocklist();

    const shouldBlock = blocklist.some(domain => url.includes(domain));
    if (shouldBlock) {
        incrementDistraction();
      
        new Notification({
          title: "🚫 Focus Bubble Alert",
          body: `Blocked access to: ${url.split("/")[2]}`
        }).show();
      }      
}

module.exports = { setupBlocking };
