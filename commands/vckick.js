const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vckick')
    .setDescription('Kullanıcıyı ses kanalından atar')
    .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');

    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
    if (!member.voice.channel) return interaction.reply({ content: 'Kullanıcı ses kanalında değil.', ephemeral: true });

    await member.voice.disconnect();
    await interaction.reply({ content: `✅ ${member.user.tag} ses kanalından atıldı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Ses Kanalından Atıldı')
      .setColor(0xff4500)
      .addFields(
        { name: 'Üye', value: member.user.tag },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
