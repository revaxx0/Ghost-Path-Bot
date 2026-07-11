const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Bir üyenin susturmasını kaldırır')
    .addUserOption(o => o.setName('üye').setDescription('Susturması kaldırılacak üye').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    if (!member) return interaction.reply({ content: 'Bu üye bulunamadı.', ephemeral: true });

    await member.timeout(null);
    await interaction.reply({ content: `${member.user.tag} susturması kaldırıldı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Susturma Kaldırıldı')
      .setColor(0x32cd32)
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
