import { Client, ClientOptions } from "discord.js";

export default class ExtendedClient extends Client {
    constructor (options: ClientOptions) {
        super(options)
    }
}