const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'ping',
    description: 'pong!',
    options: []
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Pong!')
      .setDescription('Bot is alive.')
      .setColor(0x00ff00)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
