import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
export default {
    data: new SlashCommandBuilder()
        .setName("user-reg")
        .setDescription("Register Your Handle").addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to Register.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const handle = interaction.options.getString("handle");
        const res = await CF_API.getUserRequest(handle);
        const whichProblem = await CF_API.getRandProblem();
        if (res == 400 || res == null) {
            return await interaction.editReply('User not Found!');
        }
        if (whichProblem == null) {
            return await interaction.editReply('Error Happend Contact Us');
        }


    },
};
