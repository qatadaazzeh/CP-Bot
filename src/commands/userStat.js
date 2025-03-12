import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import * as CONSTANTS from '.././api/constant.js';
import config from '../config.js';
export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Return User Details")
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const handle = interaction.options.getString("handle");
            const User = await CF_API.get_user(handle);
            if (User == null || User.length == 0) {
                return await interaction.reply('User not Found!');
            }
            let Users = ``;
            let userAvatar = ``;
            let userRank;
            User.result.forEach(user => {
                Users += `----------------------------------\n**Handle : ** \`${handle}\`\n\n**Rating : ** \`${(user.rating ? user.rating : 0)} - ${(user.rank ? user.rank : 0)}\`\n\n**Max Rating : ** \`${(user.maxRating ? user.maxRating : 0)} - ${(user.maxRank ? user.maxRank : 0)}\`\n\n**Profile Link : ** ${`https://codeforces.com/profile/${handle}`}\n----------------------------------\n`;
                userAvatar = user.titlePhoto;
                userRank = user.rank;
            });
            const color = userRank
                ? CONSTANTS.RANK_COLOR[userRank.replace(/ +/, '_')]
                : CONSTANTS.RANK_COLOR.headquarters;
            const embed = new EmbedBuilder()
                .setTitle(handle)
                .addFields({ name: "User Info", value: Users })
                .setURL(`http://codeforces.com/profile/${handle}`)
                .setThumbnail(userAvatar)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: config.embedFooter })
                .setImage(config.embedImage)
                .setColor(color);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in user command:", error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};