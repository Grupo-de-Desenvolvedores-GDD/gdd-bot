const { SlashCommandBuilder } = require('@discordjs/builders');

const COLORS = {
  amarelo: '700353209595592744',
  azul: '700351689768566865',
  vermelho: '700353041358127124',
  laranja: '700366271291719700',
  preto: '700355920001237002',
  rosa: '700355451010809950',
  roxo: '700353619811106847',
  branco: '1317897239821025320',
  verde: '1318273145567973508',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cor')
    .setDescription('Altera a sua cor no servidor.')
    .addStringOption(option =>
      option.setName('cor')
        .setDescription('A cor desejada')
        .setRequired(true)
        .addChoices(
          { name: 'Amarelo', value: 'amarelo' },
          { name: 'Azul', value: 'azul' },
          { name: 'Vermelho', value: 'vermelho' },
          { name: 'Laranja', value: 'laranja' },
          { name: 'Preto', value: 'preto' },
          { name: 'Rosa', value: 'rosa' },
          { name: 'Roxo', value: 'roxo' },
          { name: 'Branco', value: 'branco' },
          { name: 'Verde', value: 'verde' },
        )),
  async execute(interaction) {
    const cor = interaction.options.getString('cor', true);
    const guildMember = interaction.member;
    const roleIds = Object.values(COLORS);

    const botRole = guildMember.guild.members.me.roles.highest;
    const memberHighestRole = guildMember.roles.highest;

    if (botRole.comparePositionTo(memberHighestRole) <= 0) {
      return interaction.reply({ content: 'Eu não tenho permissão para modificar os seus cargos.', ephemeral: true });
    }

    const rolesToRemove = guildMember.roles.cache.filter(role => roleIds.includes(role.id));
    for (const role of rolesToRemove.values()) {
      await guildMember.roles.remove(role);
    }

    const newRoleId = COLORS[cor];
    if (newRoleId) {
      await guildMember.roles.add(newRoleId);
      await interaction.reply({ content: `Sua cor foi alterada para **${cor}**!`, ephemeral: true });
    } else {
      await interaction.reply({ content: 'Cor inválida!', ephemeral: true });
    }
  },
};
