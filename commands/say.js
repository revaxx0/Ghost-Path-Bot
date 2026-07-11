const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot belirtilen mesajı yazar')
    .addStringOption(o => o.setName('mesaj').setDescription('Yazılacak mesaj').setRequired(true))
    .addChannelOption(o => o.setName('kanal').setDescription('Hedef kanal'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const text = interaction.options.getString('mesaj');
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    await channel.send(text);
    await interaction.reply({ content: '✅ Mesaj gönderildi.', ephemeral: true });
  },
};
