const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'kick',
    description: 'Kick a user',
    options: [
      { name: 'user', description: 'User to kick', type: 6, required: true },
      { name: 'reason', description: 'Reason for kick', type: 3, required: false }
    ]
  },
  async execute(interaction) {
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
  }
};
