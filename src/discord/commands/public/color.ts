import { Command } from "#base"
import { ApplicationCommandOptionType } from "discord.js"
import { COLORS } from "util/constants.js"

new Command({
    name: "cor",
    description: "Altera a sua cor no servidor.",
    options: [
        {
            name: "cor",
            description: "A cor desejada.",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Amarelo", value: "yellow" },
                { name: "Azul", value: "blue" },
                { name: "Vermelho", value: "red" },
                { name: "Laranja", value: "orange" },
                { name: "Preto", value: "black" },
                { name: "Rosa", value: "pink" },
                { name: "Roxo", value: "purple" },
                { name: "Branco", value: "white" },
                { name: "Verde", value: "green" },
            ]
        }
    ],
    async run(interaction) {
        const { member } = interaction

        const colorRole = (COLORS as any)[interaction.options.getString("cor", true)]
        if (!colorRole)
            return interaction.reply({ content: "Cor inválida!", ephemeral })

        Object.values(COLORS).forEach(roleId => member.roles.cache.has(roleId) && member.roles.remove(roleId))
        return member.roles.add(colorRole).then(() => interaction.reply({ content: `Sua cor foi alterada para **<@${colorRole}>**!`, ephemeral }))
    },
})