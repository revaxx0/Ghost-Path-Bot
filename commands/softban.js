const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Kullanıcıyı yasaklayıp hemen açar (mesajları temizler)')
    .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
    .addIntegerOption(o => o.setName('gün').setDescription('Kaç günlük mesaj silinsin?'))
    .addStringOption(o => o.setName('sebep').setDescription('Sebep'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const days = interaction.options.getInteger('gün') || 1;
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: 'Bu üye yasaklanamaz.', ephemeral: true });

    await interaction.guild.bans.create(member.id, { reason, deleteMessageDays: days });
    await interaction.guild.bans.remove(member.id);
    await interaction.reply({ content: `✅ ${member.user.tag} softbanlandı. Son ${days} günlük mesajları silindi.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Softban')
      .setColor(0xffa500)
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
