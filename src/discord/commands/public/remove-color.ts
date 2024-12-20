import { Command } from "#base"
import { COLORS } from "util/constants.js"

new Command({
    name: "removercor",
    description: "Remove a cor atual no servidor.",
    async run(interaction) {
        const { member } = interaction

        Object.values(COLORS).forEach(roleId => member.roles.cache.has(roleId) && member.roles.remove(roleId))
        interaction.reply({ content: "Sua cor foi removida com sucesso!", ephemeral })
    },
})