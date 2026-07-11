const fs = require('fs');
const path = require('path');

function getWarnings(guildId, userId) {
  const filePath = path.join(__dirname, '..', 'warnings', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf8');
  const all = JSON.parse(data);
  return all[userId] || [];
}

function addWarning(guildId, userId, moderatorId, reason) {
  const filePath = path.join(__dirname, '..', 'warnings', `${guildId}.json`);
  let all = {};
  if (fs.existsSync(filePath)) {
    all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  if (!all[userId]) all[userId] = [];
  all[userId].push({
    id: Date.now().toString(),
    reason,
    moderatorId,
    date: new Date().toISOString(),
  });
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
  return all[userId];
}

function removeWarning(guildId, userId, warningId) {
  const filePath = path.join(__dirname, '..', 'warnings', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return false;
  const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!all[userId]) return false;
  const idx = all[userId].findIndex(w => w.id === warningId);
  if (idx === -1) return false;
  all[userId].splice(idx, 1);
  if (all[userId].length === 0) delete all[userId];
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
  return true;
}

module.exports = { getWarnings, addWarning, removeWarning };
