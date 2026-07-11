const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnclear')
    .setDescription('Bir kullanıcının tüm uyarılarını temizler')
    .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });

    const filePath = path.join(__dirname, '..', 'warnings', `${interaction.guild.id}.json`);
    if (!fs.existsSync(filePath)) return interaction.reply({ content: 'Bu kullanıcının uyarısı yok.', ephemeral: true });

    const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!all[member.id]) return interaction.reply({ content: 'Bu kullanıcının uyarısı yok.', ephemeral: true });

    delete all[member.id];
    fs.writeFileSync(filePath, JSON.stringify(all, null, 2));

    await interaction.reply({ content: `✅ ${member.user.tag} kullanıcısının tüm uyarıları temizlendi.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Uyarılar Temizlendi')
      .setColor(0x32cd32)
      .addFields(
        { name: 'Üye', value: member.user.tag },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
