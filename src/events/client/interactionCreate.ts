import { EmbedBuilder, ChannelType, Colors, InteractionType, Interaction, GuildMember } from "discord.js";
import { commands, buttons, buttonsHandledByCollector, selectMenus, modals } from "../../utils/client.js";

export default {
    name: 'interactionCreate',
    async execute(interaction: Interaction) {
        const { client } = interaction;

        if (!client.isReady()) return;

        if (interaction.isChatInputCommand()) {
            const command = commands.get(interaction.commandName);

            if (!command) return;

            if (interaction.channel?.type == ChannelType.DM) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(`:x: Les commandes ne fonctionnent pas en privé`)
                    ]
                })
            }

            if (interaction.channel?.type == ChannelType.GuildVoice) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setDescription(":x: Commands don't work in voice channels")
                    ]
                })
            }

            try {
                const embed = new EmbedBuilder().setColor(Colors.Red)
                const user = interaction.user
                let noPerms = []
                let output = ""
                let errorMessage = ""

                if (!interaction.channel?.permissionsFor(client.user)?.has('SendMessages') && interaction.guild) {
                    embed.setDescription(`:x: I don't have permission to send a message on **${interaction.guild.name}**`)
                    if (interaction.member instanceof GuildMember)
                    return await interaction.member?.send({ embeds: [embed] }).catch();
                }

                if (command.userPerms) {
                    if (Array.isArray(command.userPerms) && command.userPerms.length > 0) {
                        for (let index = 0; index < command.userPerms.length; index++) {
                            if (!interaction.channel?.permissionsFor(user)?.has(command.userPerms[index])) {
                                noPerms.push(command.userPerms[index])
                            }
                        }

                        if (noPerms.length > 0) {
                            for (let index = 0; index < noPerms.length; index++) {
                                output += "`" + noPerms[index] + "`"
                                output += "\n"
                            }
                            if (command.userPerms) {
                                if (noPerms.length > 1) {
                                    errorMessage = ":x: You need permissions"
                                } else {
                                    errorMessage = ":x: You need permission"
                                }
                                if (!interaction.channel?.permissionsFor(user)?.has(command.userPerms)) {
                                    embed.setTitle(errorMessage).setDescription(output)
                                    await interaction.reply({ embeds: [embed], ephemeral: true })
                                    return;
                                }
                            }
                        }
                    } else {
                        if (!interaction.channel?.permissionsFor(user)?.has(command.userPerms)) {
                            embed.setTitle(":x: You need permission").setDescription("`" + command.userPerms + "`")
                            await interaction.reply({ embeds: [embed], ephemeral: true })
                            return;
                        }
                    }
                }

                if (command.botPerms) {
                    if (Array.isArray(command.botPerms) && command.botPerms.length > 0) {
                        for (let index = 0; index < command.botPerms.length; index++) {
                            if (!interaction.channel?.permissionsFor(client.user)?.has(command.botPerms[index])) {
                                noPerms.push(command.botPerms[index])
                            }
                        }

                        if (noPerms.length > 0) {
                            for (let index = 0; index < noPerms.length; index++) {
                                output += "`" + noPerms[index] + "`"
                                output += "\n"
                            }
                            if (command.botPerms) {
                                if (noPerms.length > 1) {
                                    errorMessage = ":x: I need permissions"
                                } else {
                                    errorMessage = ":x: I need permission"
                                }
                                if (!interaction.channel?.permissionsFor(client.user)?.has(command.botPerms)) {
                                    embed.setTitle(errorMessage).setDescription(output)
                                    await interaction.reply({ embeds: [embed], ephemeral: true })
                                    return;
                                }
                            }
                        }
                    } else {
                        if (!interaction.channel?.permissionsFor(client.user)?.has(command.botPerms)) {
                            embed.setTitle("x: I need permissio").setDescription("`" + command.botPerms + "`")
                            await interaction.reply({ embeds: [embed], ephemeral: true })
                            return;
                        }
                    }
                }

                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);
                if (interaction.replied) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(":x: An error has occurred")
                        ]                    
                    });
                } else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(":x: An error has occurred")
                        ],
                        ephemeral: true
                    });
                }
            }
        } else if (interaction.isButton()) {
            const { customId } = interaction
            const button = buttons.get(customId)

            if (buttonsHandledByCollector.includes(interaction.id)) return buttonsHandledByCollector.splice(buttonsHandledByCollector.indexOf(interaction.id), 1);

            if (!button) return await interaction.reply({
                content: "There is no code for this button",
                ephemeral: true
            })

            try {
                await button.execute(interaction, client)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.isAnySelectMenu()) {
            const { customId } = interaction
            const menu = selectMenus.get(customId)
            if (!menu) return await interaction.reply({
                content: "There is no code for this select menu",
                ephemeral: true
            })

            try {
                await menu.execute(interaction, client)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const { customId } = interaction
            const modal = modals.get(customId)
            if (!modal) return await interaction.reply({
                content: "There is no code for this modal",
                ephemeral: true
            })

            try {
                await modal.execute(interaction, client)
            } catch (error) {
                console.error(error)
            }
        }
    },
}
