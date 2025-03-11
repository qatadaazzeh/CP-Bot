import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays a list of available commands."),
    async execute(interaction) {
        const isAdmin = interaction.memberPermissions.has(PermissionFlagsBits.Administrator);
        const commands = interaction.client.commands.filter(cmd => {
            if (cmd.data.defaultMemberPermissions && !isAdmin) return false;
            return true;
        }).map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("📜 Help Menu")
            .setDescription("Here are the available commands:")
            .addFields({ name: "Commands", value: commands.join("\n") || "No commands available" })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg');

        await interaction.reply({ embeds: [embed] });
    },
};