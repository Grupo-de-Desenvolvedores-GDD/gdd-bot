const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tell')
    .setDescription('Envie uma mensagem privada para um usuário.')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('O usuário que receberá a mensagem.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('mensagem')
        .setDescription('A mensagem a ser enviada.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const mensagem = interaction.options.getString('mensagem');

    // Tenta enviar a mensagem para o usuário selecionado
    try {
      await usuario.send(`📬 **Mensagem de ${interaction.user.tag}:**\n${mensagem}`);
      await interaction.reply({
        content: `✅ Sua mensagem foi enviada para ${usuario.tag}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem privada:', error);
      await interaction.reply({
        content: '❌ Não consegui enviar a mensagem. O usuário pode ter mensagens privadas desativadas.',
        ephemeral: true,
      });
    }
  },
};
