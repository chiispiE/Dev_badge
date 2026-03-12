const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'serverinfo',
    description: 'Get info about the server',
    options: []
  },
  async execute(interaction) {
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
  }
};
