import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../models/User.js';

export default {
    data: new SlashCommandBuilder()
        .setName("all-users")
        .setDescription("Returns a list of all registered users")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply();
        try {
            const users = await User.find();
            if (!users || users.length === 0) {
                return interaction.editReply("No users found in the database.");
            }
            const userList = users.map(user => `• **Handle:** ${user.handle} | **Valid:** ${user.valid}`).join('\n----------------------\n');


            const maxLength = 1024;
            const fields = [];
            let currentChunk = "";
            userList.split('\n').forEach(line => {
                if (currentChunk.length + line.length + 1 > maxLength) {
                    fields.push(currentChunk);
                    currentChunk = line;
                } else {
                    currentChunk += "\n" + line;
                }
            });
            if (currentChunk.length > 0) {
                fields.push(currentChunk);
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle("Registered Users")
                .setFooter({ text: `Total Users: ${users.length}` })
                .setTimestamp();

            fields.forEach((field, idx) => {
                embed.addFields({ name: `Users Part ${idx + 1}`, value: field });
            });

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching users:", error);
            return interaction.editReply("There was an error fetching users from the database.");
        }
    },
};