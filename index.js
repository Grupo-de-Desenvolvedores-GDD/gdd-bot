// Importa as dependências necessárias
const { Client, GatewayIntentBits, REST, Routes, GuildMember } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Inicializa o cliente do Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Lista de cargos de cores e seus respectivos nomes
const COLORS = {
  amarelo: '700353209595592744',
  azul: '700351689768566865',
  vermelho: '700353041358127124',
  laranja: '700366271291719700',
  preto: '700355920001237002',
  rosa: '700355451010809950',
  roxo: '700353619811106847',
  
  // Adicione mais cores conforme necessário
};

// Registro de comandos
const commands = [
  {
    name: 'cor',
    description: 'Altera a sua cor no servidor.',
    options: [
      {
        name: 'cor',
        type: 3, // STRING
        description: 'A cor desejada',
        required: true,
        choices: [
          { name: 'Amarelo', value: 'amarelo' },
          { name: 'Azul', value: 'azul' },
          { name: 'Vermelho', value: 'vermelho' },
          { name: 'laranja', value: 'laranja' },
          { name: 'preto', value: 'preto' },
          { name: 'rosa', value: 'rosa' },
          { name: 'roxo', value: 'roxo' },
        ],
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Atualizando comandos...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
})();

// Listener para quando o bot estiver pronto
client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// Listener para interações de comandos
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, member } = interaction;

  if (commandName === 'cor') {
    const cor = options.getString('cor', true);

    if (!member || !(member instanceof GuildMember)) {
      return interaction.reply({ content: 'Não foi possível alterar sua cor.', ephemeral: true });
    }

    const roleIds = Object.values(COLORS);
    const guildMember = member;

    // Remove os cargos de cor atuais
    const rolesToRemove = guildMember.roles.cache.filter(role => roleIds.includes(role.id));
    for (const role of rolesToRemove.values()) {
      await guildMember.roles.remove(role);
    }

    // Adiciona o novo cargo de cor
    const newRoleId = COLORS[cor];
    if (newRoleId) {
      await guildMember.roles.add(newRoleId);
      await interaction.reply({ content: `Sua cor foi alterada para **${cor}**!`, ephemeral: true });
    } else {
      await interaction.reply({ content: 'Cor inválida!', ephemeral: true });
    }
  }
});

// Login do bot
client.login(TOKEN).catch(err => {
  console.error('Erro ao conectar o bot:', err);
});
