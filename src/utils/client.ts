import { AnySelectMenuInteraction, ButtonInteraction, Collection, CommandInteraction, GatewayIntentBits, ModalSubmitInteraction, Partials, PermissionResolvable, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder, Snowflake } from "discord.js"
import ExtendedClient from "./ExtendedClient.js"

const client = new ExtendedClient({
    partials: [Partials.Message],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
})

export default client

export type Command = {
    data: SlashCommandBuilder | any,
    userPerms?: PermissionResolvable | PermissionResolvable[],
    botPerms?: PermissionResolvable | PermissionResolvable[],
    execute: (interaction: CommandInteraction, client: ExtendedClient) => Promise<void>,
    onBeforeHandleInteraction?: (data: RESTPostAPIChatInputApplicationCommandsJSONBody) => void
}

export type Component = {
    data: {
        name: string
    }
}

export type Button = {
    execute: (interaction: ButtonInteraction, client: ExtendedClient) => Promise<void>,
}

export type SelectMenu = {
    execute: (interaction: AnySelectMenuInteraction, client: ExtendedClient) => Promise<void>,
}

export type Modal = {
    execute: (interaction: ModalSubmitInteraction, client: ExtendedClient) => Promise<void>,
}

export const commands = new Collection<string, Command>()
export const buttons = new Collection<string, Button>()
export const selectMenus = new Collection<string, SelectMenu>()
export const modals = new Collection<string, Modal>()
export const commandArray: any[] = []
export const buttonsHandledByCollector: Snowflake[] = []
export * from '../functions/handlers/handleCommands.js'
export * from '../functions/handlers/handleComponents.js'
export * from '../functions/handlers/handleEvents.js'