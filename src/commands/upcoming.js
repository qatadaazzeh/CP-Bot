import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import convertEpochToDate from '../utils/timeFormat.js';
import timeConvert from '../utils/timeConvert.js';
import config from '../config.js';
export default {
    data: new SlashCommandBuilder()
        .setName("contests")
        .setDescription("Return List of Upcoming Contests"),

    async execute(interaction) {
        try {
            const contests = await CF_API.get_contests();
            if (!contests || contests.length === 0) {
                return await interaction.reply('No Upcoming Contests');
            }

            const contestDetails = contests.map(contest => {
                return `----------------------------------\n` +
                    `**Name : ** \`${contest.name}\`\n\n` +
                    `**Link : ** https://codeforces.com/contest/${contest.id}\n\n` +
                    `**Start Time : ** \`${convertEpochToDate(contest.startTimeSeconds)}\`\n\n` +
                    `**Contest Duration : ** \`${timeConvert(contest.durationSeconds)}\`\n----------------------------------\n`;
            });

            const maxFieldLength = 1024;
            const fields = [];
            let currentField = '';

            contestDetails.forEach(detail => {
                if (currentField.length + detail.length > maxFieldLength) {
                    fields.push(currentField);
                    currentField = detail;
                } else {
                    currentField += detail;
                }
            });
            if (currentField.length > 0) {
                fields.push(currentField);
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle("Contest Menu")
                .setDescription("Here are the Upcoming Contests:")
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: config.embedFooter })
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL())
                .setImage(config.embedImage);

            fields.forEach((fieldValue, index) => {
                embed.addFields({ name: `Contests Part ${index + 1}`, value: fieldValue });
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in upcoming contests command:", error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};