const fs = require('fs');
const path = require('path');

const MAX_STRIKES = 3;
const STRIKE_TIMEOUT_MS = 10 * 60 * 1000;

function getStrikes(guildId, userId) {
  const filePath = path.join(__dirname, '..', 'strikes', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data[userId] || [];
}

function addStrike(guildId, userId, reason) {
  const filePath = path.join(__dirname, '..', 'strikes', `${guildId}.json`);
  let all = {};
  if (fs.existsSync(filePath)) {
    all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  if (!all[userId]) all[userId] = [];
  all[userId].push({
    id: Date.now().toString(),
    reason,
    date: new Date().toISOString(),
  });
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
  return all[userId];
}

function clearStrikes(guildId, userId) {
  const filePath = path.join(__dirname, '..', 'strikes', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return;
  const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  delete all[userId];
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
}

function getStats(guildId) {
  const filePath = path.join(__dirname, '..', 'strikes', `${guildId}.json`);
  if (!fs.existsSync(filePath)) return { totalViolations: 0, topUsers: [] };
  const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const total = Object.values(all).reduce((s, arr) => s + arr.length, 0);
  const top = Object.entries(all)
    .map(([id, arr]) => ({ id, count: arr.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  return { totalViolations: total, topUsers: top };
}

module.exports = { getStrikes, addStrike, clearStrikes, getStats, MAX_STRIKES, STRIKE_TIMEOUT_MS };
