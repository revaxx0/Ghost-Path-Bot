require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

let config;
try {
  config = require('./config.json');
} catch {
  config = {};
}

config.token = process.env.TOKEN;
config.clientId = config.clientId || process.env.CLIENT_ID;
config.guildId = config.guildId || process.env.GUILD_ID;

if (!config.token || !config.clientId || !config.guildId) {
  console.error('❌ Eksik bilgi! TOKEN, CLIENT_ID ve GUILD_ID gerekli.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`${commands.length} komut kaydediliyor...`);
    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );
    console.log(`${data.length} komut başarıyla kaydedildi.`);
  } catch (error) {
    console.error('❌ Komut kaydedilemedi:', error.message);
  }
})();
