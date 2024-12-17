// Importa as dependências necessárias
const { Client, GatewayIntentBits, REST, Routes, Collection, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Inicializa o cliente do Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.pendingTpRequests = new Map();

// Carrega os comandos dinamicamente
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Registro de comandos na API do Discord
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Removendo comandos antigos...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
    console.log('✅ Comandos antigos removidos.');

    console.log('🔄 Registrando novos comandos...');
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Novos comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar comandos:', error);
  }
})();

// Listener para quando o bot estiver pronto
client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});
// Listener para interações de comandos
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    console.log(`Comando executado: /${interaction.commandName} por ${interaction.user.tag} no servidor ${interaction.guild?.name || 'DM'}`);
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
      await interaction.reply({ content: 'Houve um erro ao executar este comando.', ephemeral: true });
    }
  }

  // Captura interações de botões (aceitar ou recusar o teleporte)
  if (interaction.isButton()) {
    if (interaction.customId === 'tpaccept') {
      const destinoId = interaction.user.id;
      if (!client.pendingTpRequests.has(destinoId)) {
        return;
      }

      const origemId = client.pendingTpRequests.get(destinoId);
      const origem = await client.users.fetch(origemId);

      // Aqui você implementaria a lógica de teleporte para o jogador 'origem'

      await origem.send(`${interaction.user.username} aceitou seu pedido de teleporte!`);
      await interaction.reply(`Você aceitou o pedido de teleporte de ${origem.username}.`);

      // Remove o pedido de teleportação
      client.pendingTpRequests.delete(destinoId);
    }

    if (interaction.customId === 'tpdeny') {
      const destinoId = interaction.user.id;
      if (!client.pendingTpRequests.has(destinoId)) {
        return;
      }

      const origemId = client.pendingTpRequests.get(destinoId);
      const origem = await client.users.fetch(origemId);

      await origem.send(`${interaction.user.username} recusou seu pedido de teleporte.`);
      await interaction.reply(`Você recusou o pedido de teleporte de ${origem.username}.`);

      // Remove o pedido de teleportação
      client.pendingTpRequests.delete(destinoId);
    }
  }
});

const randomResponses = [
  "se está usando wlib, sim!",
  "não",
  "sim",
  "pergunte novamente mais tarde",
  "sei la pohakkkkkkk",
  "será?",
  "?",
  "depende, tu tem coragem?",
  "ta querendo saber demais, parça",
  "hmm... só amanhã",
  "sim kkkkkkkkkkkkk",
  "acho que não",
  "tenho cara de oráculo por acaso?",
  "poha, pergunta pra tua mãe",
  "seria possível?",
  "tenta e descobre",
  "só deus sabe",
  "não faço ideia, parça",
  "talvez",
  "quem sabe?",
  "por que você tá me perguntando isso?",
  "tanto faz",
  "certeza absoluta que não",
  "certeza absoluta que sim",
  "depende, tá na chuva?",
  "chama o scooby-doo pra resolver",
  "nunca saberemos...",
  "tu que sabe",
  "se for quarta-feira, sim",
  "não conte comigo pra isso",
  "kkk me diz vc",
  "descubra",
  "não agora, depois",
  "tu decide, vai",
  "hmmmmm sim",
  "ainda não",
  "claro que não, animal",
  "tem certeza que quer saber?",
  "é meio relativo, né?",
  "sei lá",
  "nem quero saber",
  "por mim tá tudo certo",
  "não posso te dizer",
  "deixa quieto",
  "dá um google aí",
  "só se tu quiser",
  "não tenho certeza",
  "certeza que sim",
  "certeza que não",
  "não posso afirmar",
  "vai com calma aí",
  "dormindo, pergunta depois",
  "por favor, outra pergunta",
  "não me pergunte isso",
  "confia no processo",
  "o destino vai dizer",
  "depende, é pra matar aula?",
  "só amanhã",
  "me poupe",
  "não agora, to ocupado",
  "essa é fácil: não",
  "essa é fácil: sim",
  "não hoje, mas talvez amanhã",
  "eu diria que sim",
  "eu diria que não",
  "olha... complicado, hein?",
  "o que vc acha?",
  "vc que lute",
  "não to a fim de responder",
  "só se for pizza",
  "kkkkk talvez não",
  "talvez sim, talvez não",
  "por enquanto não",
  "não posso prometer nada",
  "preciso pensar melhor",
  "hmm, deixa pra lá",
  "to com preguiça de responder",
  "depende da sorte",
  "só se tiver café",
  "só se for agora",
  "nem adianta perguntar",
  "não entendi, mas tá tudo bem",
  "pergunta no google",
  "kkk tá achando o quê?",
  "não vou te responder",
  "fala sério, né?",
  "vai nessa que tu descobre",
  "tenta a sorte",
  "não sou teu pai, mas sim",
  "não sou teu pai, mas não",
  "não tenho palavras",
  "tem certeza disso?",
  "confia, sim",
  "confia, não",
  "talvez mais tarde",
  "quem liga?",
  "deixa o tempo responder",
  "tá me zoando, né?",
  "hoje não, mas tenta amanhã",
  "isso é segredo",
  "claro que sim, só que não",
  "não confio nessa pergunta",
  "tu sabe a resposta, né?",
  "pode ser, mas e se não for?",
  "a resposta tá dentro de você",
  "ai ai... complicado",
  "se o universo quiser, sim",
  "se o universo quiser, não",
  "é por isso que te amo",
  "isso não faz sentido",
  "só se chover",
  "só se parar de chover",
  "um dia quem sabe",
  "kkkkkk pergunta besta",
  "não tem como saber",
  "não conte comigo",
  "será que sim?",
  "será que não?",
  "não vou opinar",
  "deixa pra lá",
  "muito difícil essa",
  "relaxa e deixa rolar",
  "quem sou eu pra dizer?",
  "se vc quiser, sim",
  "é o que dizem por aí",
  "não to com cabeça pra isso",
  "por mim tá ótimo",
  "olha... talvez não",
  "é complicado, sabe?",
  "nem te conto",
  "sim... ou não",
  "kkkkkk ai meu deus",
  "pergunta difícil, hein?",
  "quem te contou isso?",
  "não vou falar nada",
  "sim, mas só hoje",
  "não, mas amanhã talvez",
  "me chama depois pra isso",
  "fala com o suporte",
  "desisto de responder",
  "só pode ser brincadeira",
  "essa eu não sei",
  "essa eu não respondo",
  "vc sabe que sim",
  "vc sabe que não",
  "será que vale a pena?",
  "vou pensar no seu caso",
  "pode deixar, eu resolvo",
  "não to com tempo pra isso",
  "tá achando que sou quem?",
  "isso é confidencial",
  "dorme e acorda amanhã",
  "simplesmente não sei",
  "isso é tão aleatório",
  "é sério isso?",
  "kkk quem liga?",
  "foca em outra coisa",
  "não rola",
  "se tu tá achando que sim, então é",
  "quer saber mesmo? não",
  "quer saber mesmo? sim",
  "ai que preguiça",
  "talvez um dia",
  "simplesmente sim",
  "simplesmente não",
  "um grande talvez",
  "não posso ajudar nisso",
  "tu que lute pra descobrir",
  "é isso aí mesmo",
  "sim, mas depende",
  "não, mas depende",
  "vc tá tentando me testar?",
  "ai ai... pergunta de novo",
  "tá querendo muito, né?",
  "não to com paciência",
  "não posso te dizer agora",
  "sim, vai nessa",
];

const randomUserIds = [
  '335024452742152204', // Substitua por IDs reais de usuários
  '561051867191443477', // Substitua por IDs reais de usuários
  '685562331350040605',
  '261936490702045186',
  '288448920949096458',// Substitua por IDs reais de usuários
];

// Evento de mensagens
client.on("messageCreate", (message) => {
  // Ignora mensagens de bots
  if (message.author.bot) return;

  // Verifica se a mensagem termina com "?" e tem 20% de chance de responder
  if ((message.content.trim().endsWith("?") && (Math.random() < 0.4)) || (message.content.trim().endsWith("?") && message.mentions.has(client.user))) {
    const randomResponse =
      randomResponses[Math.floor(Math.random() * randomResponses.length)];
    message.reply(randomResponse).catch(console.error);
  }

  if (randomUserIds.includes(message.author.id) && Math.random() < 0.2) {
    message.reply("*- disse a putinha*").catch(console.error);
  }
});

// Login do bot
client.login(TOKEN).catch(err => {
  console.error('Erro ao conectar o bot:', err);
});
