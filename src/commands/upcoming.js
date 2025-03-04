import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import convertEpochToDate from '../utils/timeFormat.js';
import timeConvert from '../utils/timeConvert.js';

export default {
    data: new SlashCommandBuilder()
        .setName("contests")
        .setDescription("Return List of Upcoming Contests"),

    async execute(interaction) {
        const contests = await CF_API.get_contests();
        if (!contests || contests.length === 0) {
            return await interaction.reply('No Upcoming Contests');
        }

        // Create an array of contest details for each contest.
        const contestDetails = contests.map(contest => {
            return `----------------------------------\n` +
                `**Name : ** \`${contest.name}\`\n\n` +
                `**Link : ** https://codeforces.com/contest/${contest.id}\n\n` +
                `**Start Time : ** \`${convertEpochToDate(contest.startTimeSeconds)}\`\n\n` +
                `**Contest Duration : ** \`${timeConvert(contest.durationSeconds)}\`\n----------------------------------\n`;
        });

        // Concatenate in chunks that do not exceed 1024 characters.
        const maxFieldLength = 1024;
        const fields = [];
        let currentField = '';

        contestDetails.forEach(detail => {
            if (currentField.length + detail.length > maxFieldLength) {
                fields.push(currentField);  // push current field as full chunk.
                currentField = detail;        // start new field with current detail.
            } else {
                currentField += detail;
            }
        });
        if (currentField.length > 0) {
            fields.push(currentField);
        }

        // Create the embed and add each part as a separate field.
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("Contest Menu")
            .setDescription("Here are the Upcoming Contests:")
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: 'https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg' })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg');

        fields.forEach((fieldValue, index) => {
            embed.addFields({ name: `Contests Part ${index + 1}`, value: fieldValue });
        });

        await interaction.reply({ embeds: [embed] });
    },
};