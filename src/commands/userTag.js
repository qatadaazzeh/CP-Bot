import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import * as CHART from '.././utils/chart.js';

export default {
    data: new SlashCommandBuilder()
        .setName("user-tag")
        .setDescription("Return User Tags Bar")
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            const handle = interaction.options.getString("handle");
            const res = await CF_API.get_userTags(handle);
            if (res == null) {
                return await interaction.editReply('User not Found!');
            }
            if (JSON.stringify(res) === "{}") {
                return await interaction.editReply("User Didn't Participate in any contest");
            }
            const buffer = await CHART.plotTagsBarChart(res);
            const attachment = new AttachmentBuilder(buffer, { name: 'rating_chart.png' });
            await interaction.editReply({
                content: `**${handle}** Tags Distribution`,
                files: [attachment],
            });
        } catch (error) {
            console.error("Error in user-tag command:", error);
            await interaction.editReply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};