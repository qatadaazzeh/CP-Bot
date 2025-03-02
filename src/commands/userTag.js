import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
import * as CHART from '.././utils/chart.js'
export default {
    data: new SlashCommandBuilder()
        .setName("user-tag")
        .setDescription("Return User Tags Bar").addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const handle = interaction.options.getString("handle");
        const res = await CF_API.get_userTags(handle);
        const buffer = await CHART.plotTagsBarChart(res);
        const attachment = new AttachmentBuilder(buffer, { name: 'rating_chart.png' });
        await interaction.editReply({
            content: `**${handle}** Tags Distribution`,
            files: [attachment],
        });
    },
};
