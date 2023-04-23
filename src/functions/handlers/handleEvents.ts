import fs, { existsSync } from 'node:fs';
import mongoose from 'mongoose';
import client from '../../utils/client.js';

export async function handleEvents () {
    if (!existsSync("./dist/events")) return;
    const eventFolders = fs.readdirSync(`./dist/events`)
    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(`./dist/events/${folder}`).filter(file => file.endsWith('.js'))

        switch (folder) {
            case "client":
                for await (const file of eventFiles) {
                    const event = (await import(`../../events/${folder}/${file}`)).default;
                    if (event.once) client.once(event.name, (...args: unknown[]) => event.execute(...args, client));
                    else client.on(event.name, (...args: unknown[]) => event.execute(...args, client));
                }
                break;

            case "mongo":
                for await (const file of eventFiles) {
                    const event = (await import(`../../events/${folder}/${file}`)).default;
                    if (event.once) mongoose.connection.once(event.name, (...args) => event.execute(...args, client));
                    else mongoose.connection.on(event.name, (...args) => event.execute(...args, client));
                }
                break;

            default:
                break;
        }
    }
}