import { Command } from "#base"
import { createEmbed } from "@magicyan/discord"
import { ApplicationCommandOptionType } from "discord.js"

new Command({
    name: "tell",
    description: "Envie uma mensagem privada para um usuário.",
    options: [
        {
            name: "usuário",
            description: "O usuário que receberá a mensagem.",
            type: ApplicationCommandOptionType.User,
            required
        },
        {
            name: "mensagem",
            description: "A mensagem a ser enviada.",
            type: ApplicationCommandOptionType.String,
            required
        }
    ],
    async run(interaction) {
        const user = interaction.options.getUser("usuário")
        if (!user)
            return interaction.reply({ content: "O usuário não encontra-se no servidor.", ephemeral })

        const message = interaction.options.getString("mensagem")
        return user.send({
            embeds: [
                createEmbed({
                    color: interaction.member.roles.highest.hexColor ?? "Blue",
                    title: "📬 **GDD | Correio** 📬",
                    description: `Você recebeu um nova mensagem.\n\n**De:** <@${interaction.user.id}>\n**Mensagem:** ${message}`
                })
            ]
        })
        .then(() => interaction.reply({ content: `Sua mensagem foi enviada para <@${user.id}>.`, ephemeral }))
        .catch(() => interaction.reply({ content: "O usuário encontra-se com a dm fechada.", ephemeral }))
    }
})