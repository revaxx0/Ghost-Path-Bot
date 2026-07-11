const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (oldMessage.author?.bot) return;
    if (!oldMessage.guild) return;
    if (oldMessage.content === newMessage.content) return;

    const embed = new EmbedBuilder()
      .setTitle('Mesaj Düzenlendi')
      .setColor(0xffa500)
      .addFields(
        { name: 'Kullanıcı', value: oldMessage.author?.tag || 'Bilinmiyor' },
        { name: 'Kanal', value: `${oldMessage.channel}` },
        { name: 'Eski', value: oldMessage.content || '(yok)' },
        { name: 'Yeni', value: newMessage.content || '(yok)' },
      )
      .setTimestamp();
    await sendLog(client, oldMessage.guild, embed);
  },
};
