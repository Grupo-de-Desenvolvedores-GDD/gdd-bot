const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tpa')
    .setDescription('Pedir para teleportar-se para outro jogador.')
    .addUserOption(option => 
      option.setName('jogador')
        .setDescription('Jogador para o qual você quer se teletransportar')
        .setRequired(true)),
  
  async execute(interaction) {
    const jogador = interaction.options.getUser('jogador');
    
    // Verifica se o jogador é o mesmo que está pedindo para teleportar
    if (jogador.id === interaction.user.id) {
      return interaction.reply('Você não pode se teletransportar para si mesmo!');
    }

    // Acesse o client do arquivo index.js
    const client = interaction.client;

    // Armazena a solicitação de teleporte
    client.pendingTpRequests.set(jogador.id, interaction.user.id);

    // Cria os botões para aceitar ou recusar o pedido de teleporte
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('tpaccept')
          .setLabel('Aceitar')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('tpdeny')
          .setLabel('Recusar')
          .setStyle('DANGER')
      );

    // Envia a mensagem com os botões para o jogador solicitado
    await jogador.send({
      content: `${interaction.user.username} pediu para teleportar-se até você!`,
      components: [row]
    });

    // Responde ao jogador que fez a solicitação
    await interaction.reply(`Pedido de teleporte enviado para ${jogador.username}.`);
  },
};
