// Importa as dependências necessárias
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, GuildMember } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Inicializa o cliente do Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Lista de cargos de cores e seus respectivos nomes
const COLORS: Record<string, string> = {
  amarelo: '1317258195093159967',
  azul: '1317258242530869379',
  vermelho: '1317258314895200400',
  verde: '1317258222683426877',
  // Adicione mais cores conforme necessário
};

// Registro de comandos
const commands = [
  new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Envia um anúncio para todos no servidor.')
    .addStringOption(option =>
      option.setName('mensagem').setDescription('A mensagem do anúncio').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('cor')
    .setDescription('Altera a sua cor no servidor.')
    .addStringOption(option =>
      option
        .setName('cor')
        .setDescription('A cor desejada')
        .setRequired(true)
        .addChoices(
          { name: 'Amarelo', value: 'amarelo' },
          { name: 'Azul', value: 'azul' },
          { name: 'Vermelho', value: 'vermelho' },
          { name: 'Verde', value: 'verde' }
        )
    ),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN!);

(async () => {
  try {
    console.log('🔄 Atualizando comandos...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), { body: commands });
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
})();

// Listener para quando o bot estiver pronto
client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user?.tag}`);
});

// Listener para interações de comandos
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, member } = interaction;

  // if (commandName === 'anuncio') {
  //   const mensagem = options.getString('mensagem', true);
  //   const embed = new EmbedBuilder()
  //     .setTitle('📢 Anúncio')
  //     .setDescription(mensagem)
  //     .setColor('Yellow')
  //     .setFooter({ text: 'Anúncio feito por ' + interaction.user.tag })
  //     .setTimestamp();

  //   await interaction.reply({ content: '@everyone', embeds: [embed], allowedMentions: { parse: ['everyone'] } });
  // } else 
  if (commandName === 'cor') {
    const cor = options.getString('cor', true) as keyof typeof COLORS;

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
