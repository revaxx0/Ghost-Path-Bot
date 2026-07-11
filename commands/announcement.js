const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('Özel duyuru gönderir')
    .addStringOption(o => o.setName('başlık').setDescription('Duyuru başlığı').setRequired(true))
    .addStringOption(o => o.setName('mesaj').setDescription('Duyuru mesajı').setRequired(true))
    .addChannelOption(o => o.setName('kanal').setDescription('Gönderilecek kanal'))
    .addStringOption(o => o.setName('renk').setDescription('Renk kodu (örn: #ff0000)'))
    .addStringOption(o => o.setName('footer').setDescription('Alt yazı'))
    .addStringOption(o =>
      o.setName('mention')
        .setDescription('@everyone mentionı eklensin mi?')
        .addChoices({ name: 'Evet', value: 'everyone' }, { name: 'Hayır', value: 'none' }),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const title = interaction.options.getString('başlık');
    const message = interaction.options.getString('mesaj');
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    const color = interaction.options.getString('renk') || '#5865f2';
    const footer = interaction.options.getString('footer') || `${interaction.guild.name} • Duyuru`;
    const mention = interaction.options.getString('mention');

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setColor(color.startsWith('#') ? parseInt(color.slice(1), 16) : 0x5865f2)
      .setFooter({ text: footer })
      .setTimestamp();

    const sendOptions = { embeds: [embed] };
    if (mention === 'everyone') {
      sendOptions.content = '@everyone';
      sendOptions.allowedMentions = { parse: ['everyone'] };
    }

    await channel.send(sendOptions);
    await interaction.reply({ content: `✅ Duyuru ${channel} kanalına gönderildi!`, flags: MessageFlags.Ephemeral });
  },
};
