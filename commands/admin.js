const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, version } = require('discord.js');
const { getStats } = require('../utils/strikes');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin paneli - moderasyon istatistikleri ve yönetim')
    .addSubcommand(s => s.setName('panel').setDescription('Admin kontrol panelini gösterir'))
    .addSubcommand(s =>
      s.setName('strikes')
        .setDescription('Bir kullanıcının strike bilgilerini gösterir')
        .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true)),
    )
    .addSubcommand(s =>
      s.setName('strike-temizle')
        .setDescription('Bir kullanıcının tüm strikelarını temizler')
        .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true)),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'panel') {
      const guild = interaction.guild;
      const members = await guild.members.fetch();
      const bots = members.filter(m => m.user.bot).size;
      const humans = members.size - bots;
      const online = members.filter(m => m.presence?.status === 'online').size;
      const strikes = getStats(guild.id);

      const totalModActions = fs.existsSync(path.join(__dirname, '..', 'warnings', `${guild.id}.json`))
        ? Object.values(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'warnings', `${guild.id}.json`), 'utf8'))).reduce((s, a) => s + a.length, 0)
        : 0;

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`🛡️ Admin Paneli - ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .addFields(
          { name: '👥 Sunucu Üyeleri', value: `${humans} kullanıcı, ${bots} bot`, inline: true },
          { name: '🟢 Çevrimiçi', value: `${online}`, inline: true },
          { name: '📝 Toplam Uyarı', value: `${totalModActions}`, inline: true },
          { name: '⚠️ Auto-Mod İhlalleri', value: `${strikes.totalViolations}`, inline: true },
          { name: '🔨 Son 10 Strike', value: strikes.totalViolations > 0
            ? strikes.topUsers.map(u => `<@${u.id}>: ${u.count} strike`).join('\n') || 'Yok'
            : 'Henüz ihlal yok', inline: false },
        )
        .setFooter({ text: `Bot v1.0 • discord.js ${version}` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (sub === 'strikes') {
      const member = interaction.options.getMember('üye');
      if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
      const filePath = path.join(__dirname, '..', 'strikes', `${interaction.guild.id}.json`);
      let strikes = [];
      if (fs.existsSync(filePath)) {
        const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        strikes = all[member.id] || [];
      }
      if (strikes.length === 0) {
        return interaction.reply({ content: `${member.user.tag} kullanıcısının strike kaydı yok.`, ephemeral: true });
      }
      const embed = new EmbedBuilder()
        .setColor(0xff4500)
        .setTitle(`⚠️ ${member.user.tag} - Strike Geçmişi`)
        .setDescription(strikes.map((s, i) =>
          `**#${i + 1}** | ID: \`${s.id}\`\nSebep: ${s.reason}\nTarih: ${new Date(s.date).toLocaleString('tr-TR')}`,
        ).join('\n\n'))
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (sub === 'strike-temizle') {
      const member = interaction.options.getMember('üye');
      if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
      const { clearStrikes } = require('../utils/strikes');
      clearStrikes(interaction.guild.id, member.id);
      await interaction.reply({ content: `✅ ${member.user.tag} kullanıcısının tüm strikeları temizlendi.`, ephemeral: true });
    }
  },
};
