const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Exibe o avatar de um usuário.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('O usuário para exibir o avatar. (Opcional)')),
  async execute(interaction) {
    // Obtém o usuário da opção ou usa o autor da interação
    const user = interaction.options.getUser('user') || interaction.user;

    // URL do avatar do usuário
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

    // Responde com o avatar
    await interaction.reply({
      content: `🖼️ Aqui está o avatar de **${user.username}**:\n${avatarUrl}`,
    });
  },
};
