const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const ALL_INTENTS = Object.values(GatewayIntentBits).reduce((a, b) => a | b, 0);

function createClient() {
  const client = new Client({
    intents: ALL_INTENTS,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
  return client;
}

function registerCommands(client) {
  const commands = [
    { name: 'ping', description: 'pong!', options: [] },
  ];
  client.on('ready', async () => {
    console.log(`Ready as ${client.user.tag}`);
    try {
      await client.application.commands.set(commands);
      console.log('Slash commands registered');
    } catch (err) {
      console.error('Failed to register commands', err);
    }
  });
}

function registerInteractionHandler(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'ping') {
      await interaction.reply('pong!');
    }
  });
}

function start() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error('DISCORD_BOT_TOKEN is not set in environment');
    process.exit(1);
  }

  const client = createClient();
  registerCommands(client);
  registerInteractionHandler(client);
  client.login(token).catch(err => {
    console.error('Failed to login', err);
    process.exit(1);
  });
}

module.exports = { start };
