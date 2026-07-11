const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Bot güvenlik özelliklerini gösterir'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🛡️ Güvenlik Bilgileri')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(`
**${interaction.client.user.username}** en üst düzey güvenlik önlemleriyle donatılmıştır.

**🔒 Kişisel Veri Koruması**
• TC Kimlik No tespiti ve maskelenmiş loglama
• Telefon numarası tespiti ve maskelenmiş loglama
• E-posta adresi tespiti ve maskelenmiş loglama
• Kredi kartı bilgisi tespiti ve maskelenmiş loglama
• Hiçbir hassas veri log kanalında düz metin görünmez

**🔐 Token Güvenliği**
• Token artık .env dosyasında saklanıyor
• config.json token içermiyor
• .gitignore ile koruma altında
• Ortam değişkeni öncelikli

**🛡️ Auto-Mod Koruma**
• Küfür/hakaret filtresi (Türkçe + İngilizce)
• Spam koruması (hızlı mesaj & tekrar)
• Aşırı mention koruması
• Discord davet linki engelleme
• Aşırı link koruması

**⚡ Rate Limiter**
• Komut spam koruması
• Otomatik hız sınırlama

**💬 DM Koruması**
• DM mesajları tamamen engellendi
• Hiçbir kullanıcı bota DM atamaz

**📋 Log Güvenliği**
• Tüm işlemler log kanalına kaydedilir
• Hata mesajlarında stack trace gizlenir
• Hassas veriler maskelenir
      `)
      .setFooter({ text: 'En üst düzey güvenlik' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};
