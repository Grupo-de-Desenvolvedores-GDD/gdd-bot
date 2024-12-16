const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tpa')
    .setDescription('Pedir para teleportar-se para outro jogador.')
    .addUserOption(option =>
      option.setName('jogador')
        .setDescription('Jogador para o qual você quer se teletransportar')
        .setRequired(true)),
  
  async execute(interaction) {
    const solicitante = interaction.user; // Quem enviou o comando
    const jogador = interaction.options.getUser('jogador'); // O alvo do teleporte

    // Verifica se o jogador é o mesmo que está pedindo para teleportar
    if (jogador.id === solicitante.id) {
      return interaction.reply({ content: 'Você não pode se teletransportar para si mesmo!', ephemeral: true });
    }

    // Acesse o client do arquivo index.js
    const client = interaction.client;

    // Armazena a solicitação de teleporte
    client.pendingTpRequests.set(jogador.id, solicitante.id);

    // Cria os botões para aceitar ou recusar o pedido de teleporte
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('tpaccept')
          .setLabel('Aceitar')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('tpdeny')
          .setLabel('Recusar')
          .setStyle(ButtonStyle.Danger)
      );

    // Envia uma mensagem no canal mencionando os dois usuários
    await interaction.reply({
      content: `📨 ${solicitante} pediu para se teletransportar até ${jogador}.`,
      components: [row],
    });

    // Tenta notificar o jogador no privado
    try {
      await jogador.send(`📨 ${solicitante.tag} pediu para se teletransportar até você no servidor. Use os botões no chat do servidor para aceitar ou recusar.`);
    } catch (error) {
      // Se não for possível enviar no privado, notifica no servidor
      await interaction.followUp({
        content: `⚠️ ${jogador}, você recebeu um pedido de teleporte de ${solicitante}. Use os botões acima para aceitar ou recusar.`,
        ephemeral: false,
      });
    }
  },
};
