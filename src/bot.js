const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
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
    { name: 'ban', description: 'Ban a user', options: [
      {
        name: 'user',
        description: 'User to ban',
        type: 6, // USER
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for ban',
        type: 3, // STRING
        required: false
      }
    ] },
    { name: 'kick', description: 'Kick a user', options: [
      {
        name: 'user',
        description: 'User to kick',
        type: 6, // USER
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for kick',
        type: 3, // STRING
        required: false
      }
    ] },
    { name: 'userinfo', description: 'Get info about a user', options: [
      {
        name: 'user',
        description: 'User to get info about',
        type: 6, // USER
        required: false
      }
    ] },
    { name: 'serverinfo', description: 'Get info about the server', options: [] },
    { name: 'help', description: 'Show bot commands', options: [] }
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
      const embed = new EmbedBuilder()
        .setTitle('Pong!')
        .setDescription('Bot is alive.')
        .setColor(0x00ff00)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (interaction.commandName === 'ban') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const embed = new EmbedBuilder()
          .setTitle('Permission Denied')
          .setDescription('You need Ban Members permission to use this command.')
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const member = interaction.guild.members.cache.get(user.id);
      if (!member) {
        const embed = new EmbedBuilder()
          .setTitle('User Not Found')
          .setDescription('That user is not in this server.')
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      try {
        await member.ban({ reason });
        const embed = new EmbedBuilder()
          .setTitle('User Banned')
          .setDescription(`${user.tag} was banned.\nReason: ${reason}`)
          .setColor(0xffa500);
        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        const embed = new EmbedBuilder()
          .setTitle('Ban Failed')
          .setDescription('Could not ban the user.\n' + err.message)
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      return;
    }
    if (interaction.commandName === 'kick') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const embed = new EmbedBuilder()
          .setTitle('Permission Denied')
          .setDescription('You need Kick Members permission to use this command.')
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const member = interaction.guild.members.cache.get(user.id);
      if (!member) {
        const embed = new EmbedBuilder()
          .setTitle('User Not Found')
          .setDescription('That user is not in this server.')
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      try {
        await member.kick(reason);
        const embed = new EmbedBuilder()
          .setTitle('User Kicked')
          .setDescription(`${user.tag} was kicked.\nReason: ${reason}`)
          .setColor(0xffa500);
        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        const embed = new EmbedBuilder()
          .setTitle('Kick Failed')
          .setDescription('Could not kick the user.\n' + err.message)
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      return;
    }
    if (interaction.commandName === 'userinfo') {
      const user = interaction.options.getUser('user') || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
      const embed = new EmbedBuilder()
        .setTitle('User Info')
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: 'Username', value: user.tag, inline: true },
          { name: 'ID', value: user.id, inline: true },
          { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp/1000)}:F>` : 'N/A', inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp/1000)}:F>`, inline: true }
        )
        .setColor(0x3498db);
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (interaction.commandName === 'serverinfo') {
      const guild = interaction.guild;
      const embed = new EmbedBuilder()
        .setTitle('Server Info')
        .setThumbnail(guild.iconURL())
        .addFields(
          { name: 'Server Name', value: guild.name, inline: true },
          { name: 'Server ID', value: guild.id, inline: true },
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp/1000)}:F>`, inline: true }
        )
        .setColor(0x2ecc71);
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (interaction.commandName === 'help') {
      const embed = new EmbedBuilder()
        .setTitle('Bot Commands')
        .setDescription('List of available commands:')
        .addFields(
          { name: '/ping', value: 'Check if the bot is alive', inline: false },
          { name: '/userinfo [user]', value: 'Get info about a user', inline: false },
          { name: '/serverinfo', value: 'Get info about the server', inline: false },
          { name: '/ban user [reason]', value: 'Ban a user (requires permission)', inline: false },
          { name: '/kick user [reason]', value: 'Kick a user (requires permission)', inline: false }
        )
        .setColor(0x7289da);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
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
