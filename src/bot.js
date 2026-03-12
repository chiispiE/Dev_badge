const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const ALL_INTENTS = Object.values(GatewayIntentBits).reduce((a, b) => a | b, 0);

function createClient() {
  const client = new Client({
    intents: ALL_INTENTS,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
  return client;
}

function loadCommands() {
  const commands = new Map();
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.set(command.data.name, command);
  }
  return commands;
}

function registerCommands(client, commands) {
  const slashCommands = Array.from(commands.values()).map(cmd => cmd.data);
  client.on('ready', async () => {
    console.log(`Ready as ${client.user.tag}`);
    try {
      await client.application.commands.set(slashCommands);
      console.log('Slash commands registered');
    } catch (err) {
      console.error('Failed to register commands', err);
    }
  });
}

function registerInteractionHandler(client, commands) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
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
  const commands = loadCommands();
  registerCommands(client, commands);
  registerInteractionHandler(client, commands);
  client.login(token).catch(err => {
    console.error('Failed to login', err);
    process.exit(1);
  });
}

module.exports = { start };
