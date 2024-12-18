import { Command } from "#base"
import { createEmbed, createRow } from "@magicyan/discord"
import { add, get } from "cache/teleports.js"
import { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from "discord.js"

new Command({
    name: "tpa",
    description: "Pedir para teleportar-se para outro jogador.",
    options: [
        {
            name: "usuário",
            description: "Usuário para o qual você quer teletransportar-se.",
            type: ApplicationCommandOptionType.User,
            required
        }
    ],
    async run(interaction) {
        const target = interaction.options.getUser("usuário")
        if (!target)
            return interaction.reply({ content: "❌ O usuário mencionado não foi encontrado no servidor.", ephemeral });

        const user = interaction.user
        if (user.id === target.id)
            return interaction.reply({ content: "Você não pode se teletransportar para si mesmo!", ephemeral })

        if (get(target.id).filter(pending => pending.target === user.id && pending.expiresIn > Date.now()))
            return interaction.reply({ content: "Você já possui um pedido de teletransporte pendente para esse usuário.", ephemeral })

        add(user.id, target.id)

        const embeds = [createEmbed({
            color: "Yellow",
            title: "**PEDIDO DE TELEPORTE**",
            description: `\nVocê recebeu um pedido de teletranspote enviado por **${user.globalName ?? user.username}**.`,
            thumbnail: "https://cdn.discordapp.com/icons/310453414511247360/9ef170766e43fa686ad3f3ffbbe98270.webp?size=1024&format=webp&width=447&height=447"
        })]

        const components = [createRow(
            new ButtonBuilder({
                customId: `tpaccept/${user.id}`,
                label: "Aceitar",
                style: ButtonStyle.Success
            }),
            new ButtonBuilder({
                customId: `tpdeny/${user.id}`,
                label: "Recusar",
                style: ButtonStyle.Danger
            })
        )]

        interaction.deferReply({ ephemeral })
        return target.send({ embeds, components })
            .then(() => interaction.editReply({ content: "Pedido de teletransporte enviado com sucesso." }))
            .catch(() => {
                interaction.editReply({ content: "Pedido de teletransporte enviado com sucesso." })
                interaction.channel?.send({
                    content: `<@${target.id}>`,
                    embeds,
                    components
                })
            })
    }
})