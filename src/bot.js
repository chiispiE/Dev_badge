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
  const loadedNames = new Set();

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    let command;
    try {
      command = require(filePath);
    } catch (err) {
      console.error(`[❌] Error al cargar ${file}:`, err);
      continue;
    }

    if ('data' in command && 'execute' in command) {
      if (loadedNames.has(command.data.name)) {
        console.warn(`[⚠️] Comando duplicado detectado: ${command.data.name} en ${file}`);
        continue;
      }
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data);
      loadedNames.add(command.data.name);
      console.log(`[✅] Comando cargado: ${command.data.name}`);
    } else {
      console.warn(`[⚠️] El comando en ${file} es inválido (falta data o execute).`);
    }
  }
  if (slashCommands.length === 0) {
    console.warn('[⚠️] No se cargaron comandos válidos.');
  }
  return slashCommands;
}

function reloadCommands(client) {
  const commandsPath = path.join(__dirname, 'commands');
  if (!fs.existsSync(commandsPath)) {
    console.warn(`[⚠️] Directorio no encontrado: ${commandsPath}`);
    return [];
  }
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    delete require.cache[require.resolve(filePath)];
  }
  return loadCommands(client);
}

function reloadEvents(client, slashCommands) {
  client.removeAllListeners('ready');
  client.removeAllListeners('interactionCreate');
  client.removeAllListeners('messageCreate');
  registerEvents(client, slashCommands);
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

function setupBot(client) {
  const slashCommands = loadCommands(client);
  registerEvents(client, slashCommands);
  return slashCommands;
}

function start() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error('[❌] Error: DISCORD_BOT_TOKEN no definido en el archivo .env');
    process.exit(1);
  }

  const client = createClient();
  let slashCommands = setupBot(client);
  
  client.login(token).catch(err => {
    console.error('[❌] Error al conectar a Discord:', err);
    process.exit(1);
  });

  client.on('messageCreate', async (msg) => {
    if (msg.content === '!reload' && msg.member?.permissions.has('Administrator')) {
      slashCommands = reloadCommands(client);
      reloadEvents(client, slashCommands);
      try {
        await client.application.commands.set(slashCommands);
        msg.reply('✅ Comandos y eventos recargados correctamente.');
      } catch (err) {
        msg.reply('❌ Error al recargar comandos o eventos.');
      }
    }
  });
}

module.exports = { start, reloadCommands, reloadEvents, setupBot };
