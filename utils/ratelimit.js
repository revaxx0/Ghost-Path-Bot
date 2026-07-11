const cooldowns = new Map();

const DEFAULTS = {
  default: { count: 5, window: 5000 },
  admin: { count: 10, window: 10000 },
};

function checkRateLimit(userId, commandName) {
  const limits = DEFAULTS[commandName] || DEFAULTS.default;
  const key = `${userId}:${commandName}`;
  const now = Date.now();

  if (!cooldowns.has(key)) {
    cooldowns.set(key, []);
  }

  const timestamps = cooldowns.get(key).filter(t => now - t < limits.window);
  timestamps.push(now);
  cooldowns.set(key, timestamps);

  return timestamps.length > limits.count ? Math.ceil((limits.window - (now - timestamps[0])) / 1000) : 0;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of cooldowns.entries()) {
    const valid = timestamps.filter(t => now - t < 30000);
    if (valid.length === 0) cooldowns.delete(key);
    else cooldowns.set(key, valid);
  }
}, 60000);

module.exports = { checkRateLimit };
