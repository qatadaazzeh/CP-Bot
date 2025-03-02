import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import * as CHART from '.././utils/chart.js';
import rateRange from '.././utils/rateRange.js'
import * as CONSTANTS from '.././api/constant.js'
export default {
    data: new SlashCommandBuilder()
        .setName("user-change")
        .setDescription("Return User Rating Change")
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const handle = interaction.options.getString("handle");
        const res = await CF_API.getUserRateChange(handle);
        if (res === null) {
            return await interaction.editReply('User not Found!');
        }
        if (JSON.stringify(res) === "{}") {
            return await interaction.editReply("User Didn't Participate in any contest");
        }
        const buffer = await CHART.plotRatingChange(res);
        const attachment = new AttachmentBuilder(buffer, { name: 'rating_chart.png' });

        const embed = new EmbedBuilder()
            .setColor(CONSTANTS.RANK_COLOR[rateRange(res[Object.keys(res)[Object.keys(res).length - 1]])])
            .setTitle(`${handle} Rating Change`)
            .setImage('attachment://rating_chart.png')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed],
            files: [attachment],
        });
    },
};