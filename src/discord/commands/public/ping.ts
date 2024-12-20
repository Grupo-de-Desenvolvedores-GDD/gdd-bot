import { Command } from "#base"
import { ApplicationCommandType } from "discord.js"

new Command({
	name: "ping",
	description: "Replies with pong 🏓",
	type: ApplicationCommandType.ChatInput,
	run(interaction){
		interaction.reply({ ephemeral, content: "🏓 Pong!" });
	}
})