import { Responder, ResponderType } from "#base"
import { get, remove } from "cache/teleports.js"

new Responder({
    customId: "tpaccept/:id",
    type: ResponderType.Button,
    async run(interaction, params) {
        const pendings = get(interaction.user.id)
        const pending = pendings.filter(pending => pending.target === params.id && pending.expiresIn > Date.now())[0]
        if (!pending)
            return interaction.reply({ content: "O pedido de teletransporte expirou." })

        const user = interaction.user
        const targetUser = await interaction.client.users.fetch(pending.target)

        targetUser.send(`${user.globalName ?? user.username} aceitou seu pedido de teleporte!`)
        interaction.reply({ content: `Você aceitou o pedido de teleporte de <@${pending.target}>.`, ephemeral })

        return remove(user.id, targetUser.id)
    },
})