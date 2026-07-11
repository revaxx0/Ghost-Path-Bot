const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Rol yönetimi')
    .addSubcommand(s => s.setName('ekle').setDescription('Kullanıcıya rol verir')
      .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
      .addRoleOption(o => o.setName('rol').setDescription('Verilecek rol').setRequired(true)))
    .addSubcommand(s => s.setName('çıkar').setDescription('Kullanıcıdan rol alır')
      .addUserOption(o => o.setName('üye').setDescription('Kullanıcı').setRequired(true))
      .addRoleOption(o => o.setName('rol').setDescription('Alınacak rol').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const member = interaction.options.getMember('üye');
    const role = interaction.options.getRole('rol');

    if (!member) return interaction.reply({ content: 'Üye bulunamadı.', ephemeral: true });
    if (role.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'Bu rolü yönetemezsin.', ephemeral: true });
    }

    if (sub === 'ekle') {
      if (member.roles.cache.has(role.id)) return interaction.reply({ content: 'Bu rol zaten var.', ephemeral: true });
      await member.roles.add(role);
      await interaction.reply({ content: `✅ ${member.user.tag} kullanıcısına <@&${role.id}> rolü verildi.`, ephemeral: true });
    } else {
      if (!member.roles.cache.has(role.id)) return interaction.reply({ content: 'Bu role sahip değil.', ephemeral: true });
      await member.roles.remove(role);
      await interaction.reply({ content: `✅ ${member.user.tag} kullanıcısından <@&${role.id}> rolü alındı.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(sub === 'ekle' ? 'Rol Verildi' : 'Rol Alındı')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Üye', value: member.user.tag },
        { name: 'Rol', value: role.name },
        { name: 'Yetkili', value: interaction.user.tag },
      )
      .setTimestamp();
    await sendLog(interaction.client, interaction.guild, embed);
  },
};
