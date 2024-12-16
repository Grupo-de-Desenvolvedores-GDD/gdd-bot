const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tpaccept')
    .setDescription('Aceitar pedido de teleportação'),
  async execute(interaction) {
    const destinoId = interaction.user.id;

    if (!interaction.client.pendingTpRequests.has(destinoId)) {
      return interaction.reply('Você não tem nenhum pedido de teleporte pendente.');
    }

    const origemId = interaction.client.pendingTpRequests.get(destinoId);
    const origem = await interaction.client.users.fetch(origemId);

    // Aqui você deve adicionar a lógica de teleporte para o jogo.
    // Vamos simular a resposta por enquanto.
    
    // Envia confirmação para o jogador que pediu o teleporte
    await origem.send(`${interaction.user.username} aceitou seu pedido de teleporte!`);

    // Envia confirmação para o jogador que aceitou
    await interaction.reply(`Você aceitou o pedido de teleporte de ${origem.username}.`);

    // Remove o pedido de teleportação
    interaction.client.pendingTpRequests.delete(destinoId);
  },
};
