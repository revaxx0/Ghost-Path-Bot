const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Bir kullanıcı hakkında bilgi gösterir')
    .addUserOption(o => o.setName('üye').setDescription('Bilgisi görüntülenecek üye')),
  async execute(interaction) {
    const member = interaction.options.getMember('üye') || interaction.member;
    const user = member.user;

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} - Kullanıcı Bilgisi`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setColor(member.displayHexColor || 0x5865f2)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Hesap Oluşturma', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Katılma Tarihi', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roller', value: member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(' ') || 'Yok' },
        { name: 'Bot?', value: user.bot ? 'Evet' : 'Hayır', inline: true },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
