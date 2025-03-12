import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as CF_API from '.././api/core.js';
import User from "../models/User.js";
import { ROLES } from '../api/constant.js';

export default {
    data: new SlashCommandBuilder()
        .setName("user-valid")
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
            const handleExists = await User.findOne({ handle: handle, token: String(interaction.user.id), valid: false });
            if (!handleExists) {
                return await interaction.editReply('Handle Does not exists');
            }
            if (!handleExists.isSubmissionValid()) {
                await handleExists.deleteOne();
                return await interaction.editReply('Submission time expired');
            }
            const cf_user = await CF_API.get_user(handle);
            if (!cf_user || cf_user.length == 0) {
                return await interaction.editReply('Make Sure that the handle is correct');
            }

            let user_rank = cf_user.result[0].rank;
            if (!user_rank) {
                user_rank = 'unrated';
            }
            const submissions = await CF_API.getCompiltionProblems(handle, handleExists.problem.data.contestId);
            const validSubmission = submissions.find(sub => {
                return sub.creationTimeSeconds <= handleExists.problem.timeUntil;
            });
            if (validSubmission) {
                await handleExists.deleteOne();
                const newUser = new User({
                    token: interaction.user.id,
                    handle: handle,
                    problem: handleExists.problem,
                    valid: true
                });
                await newUser.save();
                await interaction.member.roles.add(ROLES[user_rank].toString());
                return await interaction.editReply('Great You Have Been Registred and role has been assigned');
            } else {
                return await interaction.editReply('No valid submission found within the 5-minute window.');
            }
        } catch (error) {
            console.error("Error in user-valid command:", error);
            return await interaction.editReply('An error occurred while processing your request.');
        }
    },
};