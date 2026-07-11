const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memberlist')
    .setDescription('Sunucudaki üyeleri listeler')
    .addStringOption(o => o.setName('durum').setDescription('Filtre')
      .addChoices({ name: 'Çevrimiçi', value: 'online' }, { name: 'Botlar', value: 'bot' }))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const filter = interaction.options.getString('durum');
    const members = await interaction.guild.members.fetch();
    let filtered = [...members.values()];

    if (filter === 'online') filtered = filtered.filter(m => m.presence?.status === 'online');
    if (filter === 'bot') filtered = filtered.filter(m => m.user.bot);

    const total = filtered.length;
    const chunks = [];
    let chunk = '';
    for (const m of filtered.slice(0, 50)) {
      const line = `• ${m.user.tag} ${m.user.bot ? '(🤖)' : ''}`;
      if ((chunk + '\n' + line).length > 1000) {
        chunks.push(chunk);
        chunk = line;
      } else {
        chunk += (chunk ? '\n' : '') + line;
      }
    }
    if (chunk) chunks.push(chunk);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📋 Üye Listesi${filter === 'online' ? ' (Çevrimiçi)' : filter === 'bot' ? ' (Botlar)' : ''}`)
      .setDescription(chunks[0] || 'Üye yok')
      .setFooter({ text: `Toplam: ${total} üye` })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
