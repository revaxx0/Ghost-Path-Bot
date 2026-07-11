const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir üyenin yasağını kaldırır')
    .addStringOption(o => o.setName('id').setDescription('Yasağı kaldırılacak kullanıcı ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const userId = interaction.options.getString('id');

    try {
      await interaction.guild.bans.remove(userId);
      await interaction.reply({ content: `${userId} ID\'li kullanıcının yasağı kaldırıldı.`, ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle('Yasak Kaldırıldı')
        .setColor(0x32cd32)
        .addFields(
          { name: 'Kullanıcı ID', value: userId },
          { name: 'Yetkili', value: interaction.user.tag },
        )
        .setTimestamp();
      await sendLog(interaction.client, interaction.guild, embed);
    } catch {
      await interaction.reply({ content: 'Geçersiz ID veya kullanıcı yasaklı değil.', ephemeral: true });
    }
  },
};
