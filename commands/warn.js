const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { addWarning } = require('../utils/warnings');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Bir üyeyi uyarır')
    .addUserOption(o => o.setName('üye').setDescription('Uyarılacak üye').setRequired(true))
    .addStringOption(o => o.setName('sebep').setDescription('Uyarı sebebi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const reason = interaction.options.getString('sebep');

    if (!member) return interaction.reply({ content: 'Bu üye bulunamadı.', ephemeral: true });

    const warnings = addWarning(interaction.guild.id, member.id, interaction.user.id, reason);
    await interaction.reply({ content: `${member.user.tag} uyarıldı. (Toplam: ${warnings.length} uyarı)`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Üye Uyarıldı')
      .setColor(0xffd700)
      .addFields(
        { name: 'Üye', value: `${member.user.tag} (${member.id})` },
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
