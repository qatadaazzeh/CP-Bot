import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js'
import User from "../models/User.js";

export default {
    data: new SlashCommandBuilder()
        .setName("user-reg")
        .setDescription("Register Your Handle")
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to Register.")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            const handle = interaction.options.getString("handle");

            const isNotValid = await User.findOne({ handle: handle, token: String(interaction.user.id), valid: true });
            if (isNotValid) {
                return await interaction.editReply('You Have Already Registered');
            }

            const handleExists = await User.findOne({ handle: handle, token: String(interaction.user.id) });
            if (handleExists && !handleExists.isSubmissionValid()) {
                await handleExists.deleteOne();
            }

            const newHandleRecord = await User.findOne({ handle: handle, token: String(interaction.user.id) });
            if (newHandleRecord) {
                return await interaction.editReply('Handle Already Registerd');
            }

            const userExists = await User.findOne({ token: String(interaction.user.id), handle: handle });
            if (userExists) {
                return await interaction.editReply('You Have Registerd Already');
            }

            const res = await CF_API.getUserRequest(handle);
            const whichProblem = await CF_API.getRandProblem();
            if (res == 400 || res == null) {
                return await interaction.editReply('User not Found!');
            }
            if (whichProblem == null) {
                return await interaction.editReply('Error Happend Contact Us');
            }

            const newUser = new User({
                token: interaction.user.id,
                handle: handle,
                problem: {
                    data: whichProblem,
                }
            });

            await newUser.save();
            return interaction.editReply(`You Have 5 Minutes to submit https://codeforces.com/contest/${whichProblem.contestId}/problem/${whichProblem.index} as Compilation error after this use \`/user-validate\` with your handle`);
        } catch (err) {
            console.error("Error in user-reg command:", err);
            return interaction.editReply('Error Happend Contact Us');
        }
    },
};