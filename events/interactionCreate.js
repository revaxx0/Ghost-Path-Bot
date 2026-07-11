const { MessageFlags } = require('discord.js');
const { checkRateLimit } = require('../utils/ratelimit');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isStringSelectMenu()) {
      const command = client.commands.get('commands');
      if (command && command.handleSelect) {
        try {
          await command.handleSelect(interaction);
        } catch (e) {
          console.error('[MENÜ HATASI]', e.message);
        }
      }
      return;
    }

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const MOD_ROLE_ID = '1495361525626699908';
    if (interaction.guild && !interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({
        content: '❌ Bu botu kullanmak için **Moderatör** rolüne sahip olmalısın.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const cooldown = checkRateLimit(interaction.user.id, interaction.commandName);
    if (cooldown > 0) {
      await interaction.reply({
        content: `⏳ Çok hızlısın! **${cooldown}** saniye bekle.`,
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[${interaction.commandName}]`, error.message);
      const reply = { content: '❌ Bir hata oluştu.', flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  },
};
