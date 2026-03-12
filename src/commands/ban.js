const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'ban',
    description: 'Ban a user',
    options: [
      { name: 'user', description: 'User to ban', type: 6, required: true },
      { name: 'reason', description: 'Reason for ban', type: 3, required: false }
    ]
  },
  async execute(interaction) {
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
  }
};
