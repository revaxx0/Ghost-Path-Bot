const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Belirtilen miktarda mesajı siler')
    .addIntegerOption(o =>
      o.setName('miktar').setDescription('Silinecek mesaj sayısı (1-100)').setRequired(true).setMinValue(1).setMaxValue(100),
    )
    .addUserOption(o => o.setName('üye').setDescription('Sadece bu üyenin mesajlarını sil'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('miktar');
    const member = interaction.options.getMember('üye');

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: 100 });
    if (member) {
      messages = messages.filter(m => m.author.id === member.id);
    }
    const toDelete = [...messages.values()].slice(0, amount);
    await interaction.channel.bulkDelete(toDelete, true);

    await interaction.editReply({ content: `${toDelete.length} mesaj silindi.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Mesajlar Silindi')
      .setColor(0x6495ed)
      .addFields(
        { name: 'Miktar', value: `${toDelete.length}` },
        { name: 'Kanal', value: `${interaction.channel}` },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
