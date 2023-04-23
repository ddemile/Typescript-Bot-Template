import mongoose from "mongoose";
import client, { handleCommands, handleComponents, handleEvents } from "./utils/client.js"
import 'dotenv/config.js'

await handleEvents();
await handleCommands();
await handleComponents();
await client.login(process.env.TOKEN);
await mongoose.connect(process.env.MONGO_URI).catch(() => {})