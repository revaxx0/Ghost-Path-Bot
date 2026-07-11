const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Kullanıcının sunucu ismini değiştirir')
    .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
    .addStringOption(o => o.setName('isim').setDescription('Yeni isim (boş = sıfırla)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const name = interaction.options.getString('isim');

    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: 'Bu üyenin ismi değiştirilemez.', ephemeral: true });

    await member.setNickname(name);
    await interaction.reply({
      content: name ? `✅ ${member.user.tag} ismi **${name}** olarak değiştirildi.` : `✅ ${member.user.tag} ismi sıfırlandı.`,
      ephemeral: true,
    });

    const embed = new EmbedBuilder()
      .setTitle('İsim Değiştirildi')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Üye', value: member.user.tag },
        { name: 'Yeni İsim', value: name || '(Sıfırlandı)' },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
