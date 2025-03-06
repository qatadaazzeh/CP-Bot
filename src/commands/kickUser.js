import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../models/User.js';

export default {
    data: new SlashCommandBuilder()
        .setName("kick-user")
        .setDescription("Kick a user by their Handle or Discord username")
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("The Handle to kick.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply();
        try {
            const providedHandle = interaction.options.getString("handle");

            const dbRecord = await User.findOne({ handle: providedHandle });




            let member;
            if (dbRecord) {
                member = await interaction.guild.members.fetch(dbRecord.token).catch(() => null);
            }
            if (!member) {
                member = interaction.guild.members.cache.find(m =>
                    m.user.username.toLowerCase() === providedHandle.toLowerCase() ||
                    (m.displayName && m.displayName.toLowerCase() === providedHandle.toLowerCase())
                );
            }

            if (!member) {
                return await interaction.editReply('User not found in the server.');
            }

            await member.kick(`Kicked by admin using /kick-user command.`);


            if (dbRecord) {
                await dbRecord.deleteOne();
            }

            return await interaction.editReply(`User with handle \`${providedHandle}\` has been kicked from the server${dbRecord ? " and their record has been deleted from the database." : "."}`);
        } catch (error) {
            console.error("Error in kick-user command:", error);
            return await interaction.editReply("There was an error processing your request.");
        }
    },
};