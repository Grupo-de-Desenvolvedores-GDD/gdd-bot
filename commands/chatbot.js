const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Usaremos para fazer a chamada à API
require('dotenv').config(); // Certifique-se de que sua chave da API esteja no .env

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatbot')
    .setDescription('Converse com uma IA!')
    .addStringOption(option =>
      option
        .setName('mensagem')
        .setDescription('Digite sua mensagem para a IA')
        .setRequired(true)
    ),
  async execute(interaction) {
    const mensagem = interaction.options.getString('mensagem');
    
    // Envia uma mensagem de "pensando"
    await interaction.deferReply();

    try {
      // Faz a chamada para a API da OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: mensagem }],
          max_tokens: 200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Certifique-se de adicionar sua chave da API no .env
          },
        }
      );

      const respostaDaIA = response.data.choices[0].message.content;

      // Envia a resposta da IA
      await interaction.editReply(`🤖 **Resposta da IA:**\n${respostaDaIA}`);
    } catch (error) {
      console.error('Erro ao conectar com a API da OpenAI:', error);
      await interaction.editReply(
        '⚠️ Ocorreu um erro ao tentar conversar com a IA. Tente novamente mais tarde!'
      );
    }
  },
};
