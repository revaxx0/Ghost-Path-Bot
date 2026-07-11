const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Bot hakkında bilgi gösterir'),
  async execute(interaction) {
    const client = interaction.client;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const uptime = Math.floor(process.uptime());
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${client.user.username} - Bot Bilgisi`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '🤖 İsim', value: client.user.tag, inline: true },
        { name: '🆔 ID', value: client.user.id, inline: true },
        { name: '📚 Kütüphane', value: `discord.js v${version}`, inline: true },
        { name: '🟢 Node.js', value: process.version, inline: true },
        { name: '⏰ Çalışma Süresi', value: `${days}g ${hours}s ${minutes}d`, inline: true },
        { name: '🌐 Sunucular', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Toplam Kullanıcı', value: `${totalUsers}`, inline: true },
        { name: '📝 Komut Sayısı', value: `${client.commands.size}`, inline: true },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
