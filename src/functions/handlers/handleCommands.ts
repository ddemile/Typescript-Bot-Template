import { REST, Routes } from "discord.js";
import fs, { existsSync } from 'node:fs';
import { commands, commandArray, Command } from "../../utils/client.js";

export async function handleCommands() {
    if (!existsSync("./dist/commands")) return;
    const commandFolders = fs.readdirSync('./dist/commands')
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./dist/commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command: Command = (await import(`../../commands/${folder}/${file}`)).default;
            const commandData: any = command.data.toJSON()

            commands.set(command.data.name, command)
            commandArray.push(commandData)
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandArray },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error)
    }

}