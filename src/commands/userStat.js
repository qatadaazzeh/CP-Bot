//const { SlashCommandBuilder } = require("discord.js");
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
import * as CONSTANTS from '.././api/constant.js'
export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Return User Details").addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to check.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const handle = interaction.options.getString("handle");
        const User = await CF_API.get_user(handle);
        if (User == null || User.length == 0) {
            return await interaction.reply('User not Found!');
        }
        let Users = ``;
        let userAvatar = ``;
        let userRank;
        User.result.forEach(user => {
            Users += `----------------------------------\n**Handle : ** \`${handle}\`\n\n**Rating : **  \` ${(user.rating ? user.rating : 0)} - ${(user.rank ? user.rank : 0)} \` \n\n**Max Rating : ** \`${(user.maxRating ? user.maxRating : 0)} - ${(user.maxRank ? user.maxRank : 0)}\`\n\n **Profile Link : ** ${`https://codeforces.com/profile/${handle}`}\n----------------------------------\n`
            userAvatar = user.titlePhoto;
            userRank = user.rank
        });
        const color = userRank
            ? CONSTANTS.RANK_COLOR[userRank.replace(/ +/, '_')]
            : CONSTANTS.RANK_COLOR.headquarters;
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(handle)
            .addFields({ name: "User Info", value: Users })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: 'https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg' })
            .setTimestamp()
            .setThumbnail(userAvatar)
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg')
            .setURL(`http://codeforces.com/profile/${handle}`)
            .setColor(color)

        await interaction.reply({ embeds: [embed] });
        console.log(userAvatar)

    },
};
