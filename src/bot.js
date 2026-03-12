const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function createClient() {
  
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages, 
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
}

function loadCommands(client) {
  client.commands = new Collection(); 
  const commandsPath = path.join(__dirname, 'commands');
  const slashCommands = [];

  if (!fs.existsSync(commandsPath)) {
    console.warn(`[⚠️] Directorio no encontrado: ${commandsPath}`);
    return slashCommands;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data);
    } else {
      console.warn(`[⚠️] El comando en ${file} es inválido (falta data o execute).`);
    }
  }
  return slashCommands;
}

function registerEvents(client, slashCommands) {
  client.once('ready', async (c) => {
    console.log(`[✅] Bot online como ${c.user.tag}`);
    try {
      
      await client.application.commands.set(slashCommands);
      console.log(`[🚀] ${slashCommands.length} comandos registrados correctamente.`);
    } catch (err) {
      console.error('[❌] Error al registrar comandos:', err);
    }
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return; 

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`[❌] Error en /${interaction.commandName}:`, err);
      const errorMsg = { content: '❌ Hubo un error interno al ejecutar este comando.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMsg);
      } else {
        await interaction.reply(errorMsg);
      }
    }
  });
}

function start() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error('[❌] Error: DISCORD_BOT_TOKEN no definido en el archivo .env');
    process.exit(1);
  }

  const client = createClient();
  const slashCommands = loadCommands(client);
  
  registerEvents(client, slashCommands);
  
  client.login(token).catch(err => {
    console.error('[❌] Error al conectar a Discord:', err);
    process.exit(1);
  });
}

module.exports = { start };
