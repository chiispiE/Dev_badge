const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'help',
    description: 'Show bot commands',
    options: []
  },
  async execute(interaction) {
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
  }
};
