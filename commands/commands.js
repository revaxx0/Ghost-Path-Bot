const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');

const CATEGORIES = {
  '🛡️ Moderasyon': ['kick', 'ban', 'unban', 'softban', 'mute', 'unmute', 'warn', 'warnings', 'warnclear', 'clear'],
  '👮 Admin': ['admin', 'lock', 'unlock', 'slowmode', 'role', 'nick'],
  '🤖 Bot': ['info', 'botinfo', 'ping', 'commands', 'announcement', 'embed', 'say'],
  '📋 Kullanıcı': ['userinfo', 'serverinfo', 'avatar', 'memberlist', 'poll'],
  '🔊 Ses': ['vcmove', 'vckick'],
  '🎨 Diğer': ['emoji'],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Tüm komutları kategorik olarak listeler'),
  async execute(interaction) {
    const allCommands = [...interaction.client.commands.values()];

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📋 Komut Listesi')
      .setDescription('Aşağıdaki menüden kategori seçerek komutları görüntüleyebilirsin.')
      .setFooter({ text: `${interaction.client.user.username} • Toplam ${allCommands.length} komut` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('commands_menu')
        .setPlaceholder('🏷️ Kategori seç...')
        .addOptions(
          Object.entries(CATEGORIES).map(([name, cmds]) => ({
            label: `${name} (${cmds.length})`,
            value: name,
            description: cmds.map(c => `/${c}`).join(', ').slice(0, 100),
          })),
        ),
    );

    await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
  },

  async handleSelect(interaction) {
    if (interaction.customId !== 'commands_menu') return;

    const category = interaction.values[0];
    const cmds = CATEGORIES[category];
    const allCommands = [...interaction.client.commands.values()];
    const cmdDetails = cmds.map(name => {
      const cmd = allCommands.find(c => c.data.name === name);
      return cmd ? `**/${cmd.data.name}** — ${cmd.data.description}` : `**/${name}**`;
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${category} Komutları`)
      .setDescription(cmdDetails.join('\n'))
      .setFooter({ text: `${cmds.length} komut` })
      .setTimestamp();

    await interaction.update({ embeds: [embed] });
  },
};
