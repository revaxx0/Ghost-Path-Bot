const { EmbedBuilder } = require('discord.js');
const { addStrike, clearStrikes, MAX_STRIKES, STRIKE_TIMEOUT_MS } = require('../utils/strikes');
const { sendLog } = require('../utils/logger');

const PERSONAL_INFO_PATTERNS = [
  /\b(\d{3})\d{4}(\d{4})\b/g,
  /\b(05\d{2}|5\d{3})[\s-]?\d{3}[\s-]?(\d{2}[\s-]?\d{2})\b/g,
  /\b([A-Za-z0-9._%+-]+)@[A-Za-z0-9.-]+(\.[A-Za-z]{2,})\b/g,
  /\b(\d{4})\d{8}(\d{4})\b/g,
];

function maskContent(content) {
  let masked = content || '(medya)';
  PERSONAL_INFO_PATTERNS.forEach(pattern => {
    masked = masked.replace(pattern, (match, ...groups) => {
      const first = groups[0];
      const last = groups[groups.length - 1];
      return `${first}****${last}`;
    });
  });
  return masked.slice(0, 200);
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    if (message.guild === null) return;

    if (!client.automod) return;

    if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setDescription(`Merhaba! Ben **${client.user.username}** moderasyon botuyum. Tüm komutlarımı görmek için \`/commands\` yazabilirsin.`)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
      return;
    }

    const violations = await client.automod.checkMessage(message);
    if (!violations) return;

    const reasons = violations.map(v => v.type).join(', ');
    await message.delete().catch(e => console.error('[SİLME HATASI]', e.message));

    const strikes = addStrike(message.guild.id, message.author.id, reasons);
    const strikeCount = strikes.length;

    const warnEmbed = new EmbedBuilder()
      .setTitle('🚫 Mesajın Otomatik Olarak Silindi')
      .setColor(0xff0000)
      .setDescription(`**Sebep:** ${reasons}\n**Strike:** ${strikeCount}/${MAX_STRIKES}\n\nKurallara uygun yazışmak için lütfen Discord sunucu kurallarına uyun.`)
      .setTimestamp();

    try {
      await message.author.send({ embeds: [warnEmbed] });
    } catch (e) {
      console.error('[DM HATASI]', e.message);
    }

    if (strikeCount >= MAX_STRIKES) {
      const member = await message.guild.members.fetch(message.author.id).catch(() => null);
      if (member && member.moderatable) {
        await member.timeout(STRIKE_TIMEOUT_MS, `Auto-Mod: ${strikeCount} strike limiti aşıldı`);
        clearStrikes(message.guild.id, message.author.id);

        const timeoutEmbed = new EmbedBuilder()
          .setTitle('⛔ Otomatik Susturma')
          .setColor(0xff0000)
          .setDescription(`${message.author.tag} ${MAX_STRIKES} strike limitine ulaştığı için 10 dakika susturuldu.`)
          .addFields(
            { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
            { name: 'İhlaller', value: reasons },
          )
          .setTimestamp();
        await sendLog(client, message.guild, timeoutEmbed);
      }
    }

    const logEmbed = new EmbedBuilder()
      .setTitle('🚫 Auto-Mod Mesaj Silindi')
      .setColor(0xff4500)
      .addFields(
        { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
        { name: 'Kanal', value: `${message.channel}` },
        { name: 'İhlal', value: reasons },
        { name: 'Strike', value: `${strikeCount}/${MAX_STRIKES}` },
        { name: 'Mesaj İçeriği', value: maskContent(message.content) },
      )
      .setTimestamp();
    await sendLog(client, message.guild, logEmbed);
  },
};
