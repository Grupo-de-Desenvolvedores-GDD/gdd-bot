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

    if (destino.id === origem.id) {
      return interaction.reply('Você não pode se teleportar para si mesmo!');
    }

    // Verifica se já existe uma solicitação pendente para o jogador de destino
    if (interaction.client.pendingTpRequests.has(destino.id)) {
      return interaction.reply(`${destino.username} já tem uma solicitação pendente!`);
    }

    // Envia o pedido de teleportação
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('tpaccept')
          .setLabel('Aceitar Teleporte')
          .setStyle('PRIMARY')
          .setDisabled(false),
        new MessageButton()
          .setCustomId('tpdeny')
          .setLabel('Recusar Teleporte')
          .setStyle('DANGER')
          .setDisabled(false)
      );

    // Armazena a solicitação pendente
    interaction.client.pendingTpRequests.set(destino.id, origem.id);

    await destino.send({
      content: `${origem.username} deseja se teleportar para você. Você aceita?`,
      components: [row]
    });

    return interaction.reply(`Solicitação de teleporte enviada para ${destino.username}. Aguardando resposta...`);
  },
};
