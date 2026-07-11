const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getWarnings, removeWarning } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Bir üyenin uyarılarını gösterir veya siler')
    .addSubcommand(s => s.setName('göster').setDescription('Uyarıları listele')
      .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true)))
    .addSubcommand(s => s.setName('sil').setDescription('Bir uyarıyı sil')
      .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
      .addStringOption(o => o.setName('id').setDescription('Uyarı ID').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const member = interaction.options.getMember('üye');

    if (!member) return interaction.reply({ content: 'Bu üye bulunamadı.', ephemeral: true });

    if (sub === 'göster') {
      const warnings = getWarnings(interaction.guild.id, member.id);
      if (warnings.length === 0) {
        return interaction.reply({ content: `${member.user.tag} kullanıcısının uyarısı yok.`, ephemeral: true });
      }
      const embed = new EmbedBuilder()
        .setTitle(`${member.user.tag} - Uyarılar`)
        .setColor(0xffd700)
        .setDescription(warnings.map((w, i) =>
          `**#${i + 1}** | ID: \`${w.id}\`\nSebep: ${w.reason}\nYetkili: <@${w.moderatorId}>\nTarih: ${new Date(w.date).toLocaleString('tr-TR')}`,
        ).join('\n\n'))
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (sub === 'sil') {
      const id = interaction.options.getString('id');
      const result = removeWarning(interaction.guild.id, member.id, id);
      if (!result) return interaction.reply({ content: 'Uyarı ID bulunamadı.', ephemeral: true });
      await interaction.reply({ content: `Uyarı silindi.`, ephemeral: true });
    }
  },
};
