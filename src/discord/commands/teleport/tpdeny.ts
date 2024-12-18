import { Command } from "#base"
import { get, remove } from "cache/teleports.js"
import { ApplicationCommandOptionType } from "discord.js"

new Command({
    name: "tpdeny",
    description: "Negar pedido de teletransporte.",
    options: [
        {
            name: "usuário",
            description: "Usuário qual você quer negar o pedido.",
            type: ApplicationCommandOptionType.User
        }
    ],
    async run(interaction) {
        const target = interaction.options.getUser("usuário")

        const pendings = get(interaction.user.id)
        const pending = pendings.filter(pending => (target ? pending.target === target.id : true) && pending.expiresIn > Date.now())[target ? 0 : pendings.length - 1]
        if (!pending)
            return interaction.reply({ content: "Você não possui um pedido de teletransporte pendente." })

        const user = interaction.user
        const targetUser = target ?? await interaction.client.users.fetch(pending.target)

        targetUser.send(`${user.globalName ?? user.username} recusou seu pedido de teleporte!`)
        interaction.reply({ content: `Você recusou o pedido de teleporte de <@${pending.target}>.`, ephemeral })

        return remove(user.id, targetUser.id)
    }
})