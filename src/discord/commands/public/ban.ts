import { Command } from "#base"
import { createEmbed } from "@magicyan/discord"
import { ApplicationCommandOptionType } from "discord.js"

const BANNED_ROLE_ID = "1318353022346330183"

new Command({
    name: "ban",
    description: "Bane um usuário do servidor.",
    options: [
        {
            name: "usuário",
            description: "O usuário que será banido.",
            type: ApplicationCommandOptionType.User,
            required
        }
    ],
    async run(interaction) {
        const { guild, member } = interaction
        if (!guild.roles.cache.has(BANNED_ROLE_ID))
            return interaction.reply({ content: "❌ O cargo especificado para banidos não existe neste servidor.", ephemeral })

        const target = interaction.options.getMember("usuário")
        if (!target)
            return interaction.reply({ content: "❌ O usuário mencionado não foi encontrado no servidor.", ephemeral });

        if (target.roles.highest.position >= guild.members.me!.roles.highest.position)
            return interaction.reply({ content: "❌ Não posso banir este usuário, pois ele possui um cargo maior ao meu.", ephemeral })

        await interaction.reply({
            embeds: [
                createEmbed({
                    color: "Red",
                    title: "🔨 **Usuário Banido** 🔨",
                    description: `\n**Administrador:** <@${member.id}>\n**Usuário:** <@${target.id}>`,
                    image: {
                        url: "https://tenor.com/view/elmo-fire-ban-syntheticllama-gif-21044291"
                    }
                })
            ]
        })

        return member.roles.add(BANNED_ROLE_ID).then(() => interaction.followUp({ content: "Na verdade, você recebeu o cargo de banido! 😉", ephemeral }))
    }
})