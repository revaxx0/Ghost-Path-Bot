const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Kanalın kilidini açar')
    .addChannelOption(o => o.setName('kanal').setDescription('Açılacak kanal (boş = bu kanal)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal') || interaction.channel;

    await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
      SendMessages: null,
    });
    await interaction.reply({ content: `${channel} kanalının kilidi açıldı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Kanal Kilidi Açıldı')
      .setColor(0x00ff00)
      .addFields(
        { name: 'Kanal', value: `${channel}` },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
