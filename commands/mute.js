const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Bir üyeyi susturur (Timeout)')
    .addUserOption(o => o.setName('üye').setDescription('Susturulacak üye').setRequired(true))
    .addIntegerOption(o => o.setName('dakika').setDescription('Süre (dakika)').setRequired(true))
    .addStringOption(o => o.setName('sebep').setDescription('Susturma sebebi'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const minutes = interaction.options.getInteger('dakika');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    if (!member) return interaction.reply({ content: 'Bu üye bulunamadı.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: 'Bu üye susturulamaz.', ephemeral: true });

    const ms = minutes * 60 * 1000;
    await member.timeout(ms, reason);
    await interaction.reply({ content: `${member.user.tag} ${minutes} dakika susturuldu.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Üye Susturuldu')
      .setColor(0xffa500)
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Süre', value: `${minutes} dakika` },
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
