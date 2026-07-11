const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Sunucu hakkında detaylı bilgi gösterir'),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${guild.name} - Sunucu Bilgisi`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: '👑 Sahip', value: `${owner.user.tag}`, inline: true },
        { name: '🆔 ID', value: guild.id, inline: true },
        { name: '📅 Oluşturulma', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Üyeler', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Kanal Sayısı', value: `${textChannels} metin / ${voiceChannels} ses / ${categories} kategori`, inline: true },
        { name: '🎭 Roller', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🚀 Boost Seviyesi', value: `${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boost)`, inline: true },
        { name: '✅ Doğrulama', value: guild.verificationLevel === 0 ? 'Yok' : guild.verificationLevel, inline: true },
      )
      .setFooter({ text: `Sunucu ID: ${guild.id}` })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
