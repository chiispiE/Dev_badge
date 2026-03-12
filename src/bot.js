const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function createClient() {

    intents: [
      GatewayIntentBits.Guilds,

    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
}

function loadCommands(client) {

  client.commands = new Collection(); 
  const commandsPath = path.join(__dirname, 'commands');
  const slashCommands = [];


  if (!fs.existsSync(commandsPath)) {
    console.warn(`[Aviso] No se encontró el directorio de comandos: ${commandsPath}`);
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
      console.warn(`[Aviso] Al comando en ${filePath} le falta la propiedad 'data' o 'execute'.`);
    }
  }
  return slashCommands;
}

function registerEvents(client, slashCommands) {

  client.once('ready', async (c) => {
    console.log(`[Éxito] Conectado como ${c.user.tag}`);
    try {
      await client.application.commands.set(slashCommands);
      console.log(`[Éxito] Se registraron ${slashCommands.length} slash commands.`);
    } catch (err) {
      console.error('[Error] Falló el registro de comandos:', err);
    }
  });

  client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return; 

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`[Error] Comando no encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`[Error ejecutando ${interaction.commandName}]:`, err);
      

      const errorMsg = { content: 'Hubo un error al ejecutar este comando.', ephemeral: true };
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
    console.error('[Error Fatal] DISCORD_BOT_TOKEN no está definido. Revisa tu archivo .env');
    process.exit(1);
  }

  const client = createClient();
  const slashCommands = loadCommands(client);
  
  registerEvents(client, slashCommands);
  
  client.login(token).catch(err => {
    console.error('[Error Fatal] Falló el inicio de sesión:', err);
    process.exit(1);
  });
}

module.exports = { start };
