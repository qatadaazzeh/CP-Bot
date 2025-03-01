require("dotenv").config({ path: "../.env" });
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🔃 Refreshing application (/) commands...");

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

        console.log("✅ Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})();
