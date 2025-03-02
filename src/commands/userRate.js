import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
import * as CHART from '.././utils/chart.js'
export default {
    data: new SlashCommandBuilder()
        .setName("user-rate")
        .setDescription("Return User Rate Bar").addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const handle = interaction.options.getString("handle");
        const res = await CF_API.get_userAC(handle);
        if (res == null) {
            return await interaction.editReply('User not Found!');
        }
        const buffer = await CHART.plotRatingBarChart(res);
        const attachment = new AttachmentBuilder(buffer, { name: 'rating_chart.png' });
        await interaction.editReply({
            content: `**${handle}** Rating Distribution`,
            files: [attachment],
        });
    },
};
