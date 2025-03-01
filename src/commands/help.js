//const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays a list of available commands."),

    async execute(interaction) {
        const commands = interaction.client.commands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("📜 Help Menu")
            .setDescription("Here are the available commands:")
            .addFields({ name: "Commands", value: commands.join("\n") })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: 'https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg' })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg')

        await interaction.reply({ embeds: [embed] });
    },
};
