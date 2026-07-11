const { EmbedBuilder } = require('discord.js');

async function sendLog(client, guild, embed) {
  const channelId = client.config.logChannelId;
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;
  try {
    await channel.send({ embeds: [embed] });
  } catch (e) {
    console.error('Log gönderilemedi:', e.message);
  }
}

function createLogEmbed(title, description, color = 0xffa500) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

module.exports = { sendLog, createLogEmbed };
