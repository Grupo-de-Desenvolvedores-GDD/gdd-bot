// Importa as dependências necessárias
const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Inicializa o cliente do Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

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
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
 console.log(`Comando executado: /${interaction.commandName} por ${interaction.user.tag} no servidor ${interaction.guild?.name || 'DM'}`);
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'Houve um erro ao executar este comando.', ephemeral: true });
  }
});

// Login do bot
client.login(TOKEN).catch(err => {
  console.error('Erro ao conectar o bot:', err);
});
