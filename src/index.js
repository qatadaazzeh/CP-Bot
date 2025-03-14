import { config as dotenvConfig } from "dotenv";

import dbConnect from './db/connect.js'
import { Client, Collection, GatewayIntentBits, ActivityType } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
dotenvConfig({ path: path.resolve(process.cwd(), "..", ".env") });
import "./utils/cleanUp.js";

import { initWelcome } from "./welcome/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(pathToFileURL(filePath).href);
        client.commands.set(command.default.data.name, command.default);
    }

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(pathToFileURL(filePath).href);
        if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args, client));
        } else {
            client.on(event.default.name, (...args) => event.default.execute(...args, client));
        }
    }
    client.once('ready', () => {
        client.user.setActivity('ASU-Coding Club', { type: ActivityType.Watching });
        global.client = client
        import('./utils/ratingChange.js').then(module => {
            module.scheduleRatingChangeNotifications(client);
        });
        import('./utils/schedule.js').then(module => {
            module.scheduleUpcomingContests(client);
        });
        initWelcome(client)
    })

    client.login(process.env.TOKEN);
    dbConnect();
})();

