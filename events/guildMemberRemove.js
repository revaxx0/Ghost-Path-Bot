const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const embed = new EmbedBuilder()
      .setTitle('Üye Ayrıldı')
      .setColor(0xff0000)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
      )
      .setTimestamp();
    await sendLog(client, member.guild, embed);
  },
};
