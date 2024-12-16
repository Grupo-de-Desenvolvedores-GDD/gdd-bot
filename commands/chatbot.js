const { SlashCommandBuilder } = require('@discordjs/builders');
const { OpenAI } = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
  apiKey: openaiApiKey,
});

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
      const response = await openai.createCompletion({
        model: 'text-davinci-003', // ou 'gpt-3.5-turbo' ou outro modelo
        prompt: prompt,
        max_tokens: 150,
      });

      // Envia a resposta da IA no Discord
      message.reply(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('Erro ao interagir com a API da OpenAI:', error);
      message.reply('Houve um erro ao tentar responder sua mensagem.');
    }
  },
};
