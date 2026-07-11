const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if (message.author?.bot) return;
    if (!message.guild) return;

    const embed = new EmbedBuilder()
      .setTitle('Mesaj Silindi')
      .setColor(0xff6347)
      .addFields(
        { name: 'Kullanıcı', value: message.author?.tag || 'Bilinmiyor' },
        { name: 'Kanal', value: `${message.channel}` },
        { name: 'Mesaj', value: message.content || '(İçerik yok / medya)' },
      )
      .setTimestamp();
    await sendLog(client, message.guild, embed);
  },
};
