const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Bot hakkında detaylı bilgi gösterir'),
  async execute(interaction) {
    const client = interaction.client;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const uptime = Math.floor(process.uptime());
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🤖 ${client.user.username}`)
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setDescription(`
**Tam Kapsamlı Moderasyon Botu**
Sunucunuzu korumak ve yönetmek için gelişmiş auto-mod, moderasyon ve yönetim araçları.

**📊 İstatistikler**
• Sunucular: **${client.guilds.cache.size}**
• Kullanıcılar: **${totalUsers}**
• Komutlar: **${client.commands.size}**
• Çalışma Süresi: **${days}g ${hours}s ${minutes}d**
• Kütüphane: **discord.js v${version}**
• Node.js: **${process.version}**

**🛡️ Özellikler**
• AI Auto-Mod (küfür, spam, link, mention koruması)
• 3 Strike → Otomatik Susturma
• Kullanıcı yönetimi (kick, ban, mute, warn)
• Rol yönetimi
• Ses kanalı yönetimi
• Kanal yönetimi (lock, unlock, slowmode)
• Duyuru sistemi
• Anket oluşturma
• Detaylı loglama
      `)
      .setFooter({ text: 'GhostPathGuard#8321' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
