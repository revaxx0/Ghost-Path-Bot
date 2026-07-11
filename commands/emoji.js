const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Sunucuya emoji ekler')
    .addStringOption(o => o.setName('isim').setDescription('Emoji adı').setRequired(true))
    .addAttachmentOption(o => o.setName('resim').setDescription('Emoji resmi (128x128)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),
  async execute(interaction) {
    const name = interaction.options.getString('isim');
    const attachment = interaction.options.getAttachment('resim');

    if (!attachment.contentType?.startsWith('image/')) {
      return interaction.reply({ content: 'Lütfen geçerli bir resim yükle.', ephemeral: true });
    }

    const emoji = await interaction.guild.emojis.create({
      attachment: attachment.url,
      name,
    });

    await interaction.reply({ content: `✅ Emoji eklendi: <:${emoji.name}:${emoji.id}>`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Emoji Eklendi')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Emoji', value: `<:${emoji.name}:${emoji.id}>` },
        { name: 'İsim', value: emoji.name },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
