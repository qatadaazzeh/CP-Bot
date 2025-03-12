import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import ratingRange from '../utils/rateRange.js';
import config from "../config.js"
export default {
    data: new SlashCommandBuilder()
        .setName("last-contest")
        .setDescription("Returns a list of rating Changed"),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            const Contests = await CF_API.getLastContest();
            if (Contests.length == 0 || Contests == null) {
                return await interaction.editReply('In The Last Contest No Users Registered');
            }
            const usersDetails = Contests.map(user => {
                return `----------------------------------\n` +
                    `**User Handle : ** \`${user.handle}\`\n\n` +
                    `**Old Rating : ** \`${user.oldRating}\` \n\n` +
                    `**New Rating : ** \`${user.newRating}\` \n\n` +
                    `**User Delta : ** \`${user.newRating - user.oldRating}\`\n\n` +
                    `**New Rank : ** \`${String(ratingRange(user.newRating)[0]).toUpperCase() + String(ratingRange(user.newRating)).slice(1)}\`` +
                    `\n----------------------------------\n`;
            });
            const maxFieldLength = 1024;
            const fields = [];
            let currentField = '';
            usersDetails.forEach(detail => {
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
                .setTitle(`Rating Change for ${Contests[0].contestName}`)
                .setDescription("Here are the Rating Change List")
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: config.embedFooter })
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL())
                .setImage(config.embedImage);

            fields.forEach((fieldValue, index) => {
                embed.addFields({ name: `Rating Change Part ${index + 1}`, value: fieldValue });
            });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in contestRate command:", error);
            return await interaction.editReply('An error occurred while processing your request.');
        }
    },
};