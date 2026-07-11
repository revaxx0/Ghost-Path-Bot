const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Özel embed mesajı oluşturur')
    .addStringOption(o => o.setName('başlık').setDescription('Embed başlığı').setRequired(true))
    .addStringOption(o => o.setName('mesaj').setDescription('Embed içeriği').setRequired(true))
    .addStringOption(o => o.setName('renk').setDescription('Renk (#ff0000)'))
    .addChannelOption(o => o.setName('kanal').setDescription('Hedef kanal'))
    .addStringOption(o => o.setName('thumbnail').setDescription('Küçük resim URL (https ile başlamalı)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const title = interaction.options.getString('başlık');
    const desc = interaction.options.getString('mesaj');
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    const color = interaction.options.getString('renk') || '#5865f2';
    const thumb = interaction.options.getString('thumbnail');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(color.startsWith('#') ? parseInt(color.slice(1), 16) : 0x5865f2)
      .setTimestamp();

    if (thumb && /^https?:\/\//i.test(thumb)) {
      embed.setThumbnail(thumb);
    }

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Embed mesajı gönderildi.', flags: MessageFlags.Ephemeral });
  },
};
