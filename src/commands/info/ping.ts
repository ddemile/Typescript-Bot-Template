import { Command } from "../../utils/client";
import { SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply Pong! and the ping of the bot')
        .setDescriptionLocalizations({
            'fr': "Répond Pong! et le ping du bot'"
        }),
    async execute(interaction, client) {
        await interaction.reply(`Pong ! Le ping du bot est de ${client.ws.ping.toString()}`)
    }
} satisfies Command