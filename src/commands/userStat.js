//const { SlashCommandBuilder } = require("discord.js");
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'

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
        User.result.forEach(user => {
            Users += `----------------------------------\n**Handle : ** \`${handle}\`\n\n**Rating : **  \` ${user.rating} - ${user.rank} \` \n\n**Max Rating : ** \`${user.maxRating} - ${user.maxRank}\`\n\n **Profile Link : ** ${`https://codeforces.com/profile/${handle}`}\n----------------------------------\n`
            userAvatar = user.titlePhoto;
        });
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("User Menu")
            .addFields({ name: "User Info", value: Users })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: 'https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg' })
            .setTimestamp()
            .setThumbnail(userAvatar)
            .setImage('https://codeforces.com/predownloaded/e9/38/e9389f9497973e8298c7442564cae12def341113.jpeg')

        await interaction.reply({ embeds: [embed] });
    },
};
