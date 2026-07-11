const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Bir kullanıcının avatarını gösterir')
    .addUserOption(o => o.setName('üye').setDescription('Avatarı gösterilecek üye')),
  async execute(interaction) {
    const user = interaction.options.getUser('üye') || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${user.tag} - Avatar`)
      .setImage(user.displayAvatarURL({ size: 1024, extension: 'png' }))
      .setURL(user.displayAvatarURL({ size: 1024, extension: 'png' }));
    await interaction.reply({ embeds: [embed] });
  },
};
