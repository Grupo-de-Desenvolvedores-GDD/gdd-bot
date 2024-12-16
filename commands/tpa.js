const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tpa')
    .setDescription('Pedir para se teleportar para outro jogador')
    .addUserOption(option =>
      option
        .setName('destino')
        .setDescription('Jogador para o qual você deseja se teleportar')
        .setRequired(true)
    ),
  async execute(interaction) {
    const destino = interaction.options.getUser('destino');
    const origem = interaction.user;

    // Verifica se o jogador não está tentando se teleportar para si mesmo
    if (destino.id === origem.id) {
      return interaction.reply('Você não pode se teleportar para si mesmo!');
    }

    // Verifica se já existe uma solicitação pendente para o jogador de destino
    if (interaction.client.pendingTpRequests.has(destino.id)) {
      return interaction.reply(`${destino.username} já tem uma solicitação pendente!`);
    }

    // Cria uma linha de ação com os botões "Aceitar" e "Recusar"
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('tpaccept')
          .setLabel('Aceitar Teleporte')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('tpdeny')
          .setLabel('Recusar Teleporte')
          .setStyle('DANGER')
      );

    // Armazena a solicitação pendente no Map
    interaction.client.pendingTpRequests.set(destino.id, origem.id);

    // Envia a solicitação de teleporte para o jogador de destino
    await destino.send({
      content: `${origem.username} deseja se teleportar para você. Você aceita?`,
      components: [row],
    });

    // Responde para o jogador que fez a solicitação
    return interaction.reply(`Solicitação de teleporte enviada para ${destino.username}. Aguardando resposta...`);
  },
};
