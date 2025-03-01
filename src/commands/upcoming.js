//const { SlashCommandBuilder } = require("discord.js");
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
import convertEpochToDate from '../utils/timeFormat.js'
import timeConvert from '../utils/timeConvert.js'
export default {
    data: new SlashCommandBuilder()
        .setName("contests")
        .setDescription("Return List of Upcoming Contests"),

    async execute(interaction) {
        const Contests = await CF_API.get_contests();
        if (Contests.length == 0 || Contests == null) {
            return await interaction.reply('No Upcoming Contests');
        }
        let ContestMessage = ``;
        Contests.forEach(contest => {
            ContestMessage += `----------------------------------\n**Name : ** \`${contest.name}\`\n\n**Link : ** ${`https://codeforces.com/contest/${contest.id}`}\n\n**Start Time : ** \`${convertEpochToDate(contest.startTimeSeconds)}\`\n\n**Contest Duration : **\`${timeConvert(contest.durationSeconds)}\`\n----------------------------------\n`
        });
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("Contest Menu")
            .setDescription("Here are the Upcoming Contests :")
            .addFields({ name: "Contests", value: ContestMessage })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: 'https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg' })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg')

        await interaction.reply({ embeds: [embed] });
    },
};
