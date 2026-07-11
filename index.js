require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const AutoMod = require('./utils/automod');

let config;
try {
  config = require('./config.json');
} catch {
  config = {};
}

config.token = process.env.TOKEN;
config.clientId = config.clientId || process.env.CLIENT_ID;
config.guildId = config.guildId || process.env.GUILD_ID;
config.logChannelId = config.logChannelId || process.env.LOG_CHANNEL_ID;
config.modRoleId = config.modRoleId || process.env.MOD_ROLE_ID;

if (!config.token) {
  console.error('❌ TOKEN bulunamadı! .env dosyasını veya ortam değişkenlerini kontrol et.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();
client.config = config;
client.automod = new AutoMod(client);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token);
