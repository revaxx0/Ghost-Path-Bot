const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vcmove')
    .setDescription('Kullanıcıyı ses kanalları arası taşır')
    .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
    .addChannelOption(o => o.setName('kanal').setDescription('Hedef ses kanalı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('üye');
    const channel = interaction.options.getChannel('kanal');

    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
    if (!member.voice.channel) return interaction.reply({ content: 'Kullanıcı ses kanalında değil.', ephemeral: true });
    if (channel.type !== 2) return interaction.reply({ content: 'Lütfen bir ses kanalı seç.', ephemeral: true });

    await member.voice.setChannel(channel);
    await interaction.reply({ content: `✅ ${member.user.tag} <#${channel.id}> kanalına taşındı.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Ses Kanalı Taşıma')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Üye', value: member.user.tag },
        { name: 'Hedef', value: channel.name },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
