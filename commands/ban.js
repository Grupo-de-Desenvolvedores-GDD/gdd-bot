const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um usuário do servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('O usuário que será banido')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const roleId = '1318353022346330183'; // ID do cargo de banido
    const guild = interaction.guild; // Servidor
    const executor = interaction.member; // Usuário que executou o comando
    const targetUser = interaction.options.getMember('user'); // Membro mencionado no comando

    // Verifica se o cargo de banido existe
    const role = guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({ content: '❌ O cargo especificado para banidos não existe neste servidor.', ephemeral: true });
    }

    // Verifica se o bot pode interagir com o alvo
    if (!targetUser) {
      return interaction.reply({ content: '❌ O usuário mencionado não foi encontrado no servidor.', ephemeral: true });
    }

    const botMember = guild.members.me; // Referência ao bot como membro

    // Verificação de hierarquia:
    if (targetUser.roles.highest.position >= botMember.roles.highest.position) {
      return interaction.reply({
        content: '❌ Não posso banir este usuário, pois ele possui um cargo maior ao meu.',
        ephemeral: true,
      });
    }


    // Anuncia publicamente que o usuário foi "banido"
    try {
      await interaction.reply({ content: `🔨 **${executor.user.username}** baniu **${targetUser.user.username}** do servidor!` });

      // Adiciona o cargo ao executor
      await executor.roles.add(role);

      // Responde ao executor informando que ele mesmo recebeu o cargo
      await interaction.followUp({ content: 'Na verdade, você recebeu o cargo de banido! 😉', ephemeral: true });
    } catch (error) {
      console.error('Erro ao executar o comando /ban:', error);
      return interaction.followUp({ content: 'Houve um erro ao processar o comando. Verifique as permissões do bot.', ephemeral: true });
    }
  },
};
