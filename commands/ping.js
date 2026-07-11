const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot gecikmesini gösterir'),
  async execute(interaction) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Gecikmesi', value: `${Math.abs(interaction.createdTimestamp - Date.now())}ms`, inline: true },
        { name: 'API Gecikmesi', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  },
};
