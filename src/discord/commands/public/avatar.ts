import { Command } from "#base"
import { createEmbed } from "@magicyan/discord"
import { ApplicationCommandOptionType } from "discord.js"

new Command({
    name: "avatar",
    description: "Exibe o avatar de um usuário.",
    options: [
        {
            name: "usuário",
            description: "O usuário para exibir o avatar.",
            type: ApplicationCommandOptionType.User
        }
    ],
    async run(interaction) {
        const member = interaction.options.getMember("usuário") || interaction.member

        interaction.reply({
            embeds: [
                createEmbed({
                    color: member.roles.highest.hexColor ?? "Blue",
                    title: `**Avatar de ${member.nickname ?? member.user.username}**`,
                    image: {
                        url: member.displayAvatarURL({ size: 1024 })
                    }
                })
            ]
        })
    }
})