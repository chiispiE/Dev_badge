const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'userinfo',
    description: 'Get info about a user',
    options: [
      { name: 'user', description: 'User to get info about', type: 6, required: false }
    ]
  },
  async execute(interaction) {
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
  }
};
