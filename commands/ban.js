const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir üyeyi sunucudan yasaklar')
    .addUserOption(o => o.setName('üye').setDescription('Yasaklanacak üye').setRequired(true))
    .addStringOption(o => o.setName('sebep').setDescription('Yasaklanma sebebi'))
    .addIntegerOption(o => o.setName('mesaj-sil').setDescription('Kaç günlük mesaj silinsin?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('üye');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const deleteDays = interaction.options.getInteger('mesaj-sil') || 0;

    await interaction.guild.bans.create(user.id, { reason, deleteMessageDays: deleteDays });
    await interaction.reply({ content: `${user.tag} başarıyla yasaklandı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Üye Yasaklandı')
      .setColor(0xdc143c)
      .addFields(
        { name: 'Üye', value: `${user.tag} (${user.id})` },
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
