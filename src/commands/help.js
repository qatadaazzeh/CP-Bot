import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import config from "../config.js";
export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays a list of available commands."),
    async execute(interaction) {
        try {
            const isAdmin = interaction.memberPermissions.has(PermissionFlagsBits.Administrator);
            const commands = interaction.client.commands.filter(cmd => {
                if (cmd.data.default_member_permissions && !isAdmin) return false;
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
                .setImage(config.embedFooter);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in help command:", error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};