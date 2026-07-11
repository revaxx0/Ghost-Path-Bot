const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const embed = new EmbedBuilder()
      .setTitle('Üye Katıldı')
      .setColor(0x00ff00)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Hesap Oluşturma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` },
      )
      .setTimestamp();
    await sendLog(client, member.guild, embed);
  },
};
