const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Kanalı kilitler')
    .addChannelOption(o => o.setName('kanal').setDescription('Kilitlenecek kanal (boş = bu kanal)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal') || interaction.channel;

    await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
      SendMessages: false,
    });
    await interaction.reply({ content: `${channel} kanalı kilitlendi.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Kanal Kilitlendi')
      .setColor(0xff0000)
      .addFields(
        { name: 'Kanal', value: `${channel}` },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
