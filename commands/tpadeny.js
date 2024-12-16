const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tpdeny')
    .setDescription('Recusar pedido de teleportação'),
  async execute(interaction) {
    const destinoId = interaction.user.id;

    if (!interaction.client.pendingTpRequests.has(destinoId)) {
      return interaction.reply('Você não tem nenhum pedido de teleporte pendente.');
    }

    const origemId = interaction.client.pendingTpRequests.get(destinoId);
    const origem = await interaction.client.users.fetch(origemId);

    // Envia confirmação de recusa para o jogador que pediu o teleporte
    await origem.send(`${interaction.user.username} recusou seu pedido de teleporte.`);

    // Envia confirmação para o jogador que recusou
    await interaction.reply(`Você recusou o pedido de teleporte de ${origem.username}.`);

    // Remove o pedido de teleportação
    interaction.client.pendingTpRequests.delete(destinoId);
  },
};
