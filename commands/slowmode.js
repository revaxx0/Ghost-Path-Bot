const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Kanalda yavaş mod ayarlar')
    .addIntegerOption(o =>
      o.setName('saniye')
        .setDescription('Süre (0 = kapat, 1-21600 arası)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('saniye');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({
      content: seconds === 0
        ? 'Yavaş mod kapatıldı.'
        : `Yavaş mod ${seconds} saniye olarak ayarlandı.`,
      ephemeral: true,
    });

    const embed = new EmbedBuilder()
      .setTitle('Yavaş Mod Değiştirildi')
      .setColor(0x6495ed)
      .addFields(
        { name: 'Kanal', value: `${interaction.channel}` },
        { name: 'Süre', value: seconds === 0 ? 'Kapatıldı' : `${seconds} saniye` },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
