const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Anket oluşturur')
    .addStringOption(o => o.setName('soru').setDescription('Anket sorusu').setRequired(true))
    .addStringOption(o => o.setName('seçenek1').setDescription('1. seçenek').setRequired(true))
    .addStringOption(o => o.setName('seçenek2').setDescription('2. seçenek').setRequired(true))
    .addStringOption(o => o.setName('seçenek3').setDescription('3. seçenek'))
    .addStringOption(o => o.setName('seçenek4').setDescription('4. seçenek'))
    .addChannelOption(o => o.setName('kanal').setDescription('Anket kanalı'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const question = interaction.options.getString('soru');
    const options = [
      interaction.options.getString('seçenek1'),
      interaction.options.getString('seçenek2'),
      interaction.options.getString('seçenek3'),
      interaction.options.getString('seçenek4'),
    ].filter(Boolean);
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

    const desc = options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n\n');
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 ${question}`)
      .setDescription(desc)
      .setFooter({ text: `${interaction.user.tag} tarafından oluşturuldu` })
      .setTimestamp();

    const msg = await channel.send({ embeds: [embed] });
    for (let i = 0; i < options.length; i++) {
      await msg.react(emojis[i]);
    }

    await interaction.reply({ content: `✅ Anket ${channel} kanalına gönderildi.`, ephemeral: true });
  },
};
