import { readdirSync, existsSync } from 'node:fs'
import { buttons, selectMenus, modals } from '../../utils/client.js';

export async function handleComponents() {
    if (!existsSync("./dist/components")) return;
    const componentFolders = readdirSync('./dist/components')
    for (const folder of componentFolders) {
        const componentFiles = readdirSync(`./dist/components/${folder}`).filter(file => file.endsWith('.js'));

        switch (folder) {
            case "buttons":
                for (const file of componentFiles) {
                    const button = (await import(`../../components/${folder}/${file}`)).default
                    buttons.set(button.data.name, button)
                }
                break;

            case "selectMenus":
                for (const file of componentFiles) {
                    const menu = (await import(`../../components/${folder}/${file}`)).default
                    selectMenus.set(menu.data.name, menu)
                }
                break;

            case "modals":
                for (const file of componentFiles) {
                    const modal = (await import(`../../components/${folder}/${file}`)).default
                    modals.set(modal.data.name, modal)
                }
                break;

            default:
                break;
        }
    }

}