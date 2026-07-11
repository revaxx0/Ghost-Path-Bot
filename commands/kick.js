const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir üyeyi sunucudan atar')
    .addUserOption(o => o.setName('üye').setDescription('Atılacak üye').setRequired(true))
    .addStringOption(o => o.setName('sebep').setDescription('Atılma sebebi'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    if (!member) return interaction.reply({ content: 'Bu üye bulunamadı.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: 'Bu üye atılamaz.', ephemeral: true });

    await member.kick(reason);
    await interaction.reply({ content: `${member.user.tag} başarıyla atıldı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Üye Atıldı')
      .setColor(0xff4500)
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
