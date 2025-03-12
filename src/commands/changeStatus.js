import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } from 'discord.js';
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export default {
    data: new SlashCommandBuilder()
        .setName("change-status")
        .setDescription("Change the bot's activity status (Admins only)")
        .addStringOption(option =>
            option.setName("status")
                .setDescription("The status message to display")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply();
        const statusMessage = interaction.options.getString("status");


        const types = ["Playing", "Listening", "Watching", "Competing"];
        const buttons = types.map(type =>
            new ButtonBuilder()
                .setCustomId(`status_${type.toUpperCase()}`)
                .setLabel(type)
                .setStyle(ButtonStyle.Primary)
        );
        const actionRow = new ActionRowBuilder().addComponents(...buttons);


        await interaction.editReply({
            content: `Select an activity type for the status: **${statusMessage}**`,
            components: [actionRow]
        });

        try {
            if (!interaction.channel) {
                return await interaction.followUp({ content: "This command cannot be used in DMs.", ephemeral: true });
            }

            const filter = i => i.customId.startsWith("status_") && i.user.id === interaction.user.id;
            const buttonInteraction = await interaction.channel.awaitMessageComponent({ filter, time: 15000 });
            const selectedType = capitalizeFirstLetter(buttonInteraction.customId.replace("status_", ""));
            if (!(selectedType in ActivityType)) {
                return await buttonInteraction.update({ content: "Invalid selection.", components: [] });
            }

            await interaction.client.user.setActivity(statusMessage, { type: ActivityType[selectedType] });

            await buttonInteraction.update({ content: `✅ Status updated: **${selectedType} ${statusMessage}**`, components: [] });

        } catch (err) {
            console.error("Error or timeout during status type selection:", err);
            await interaction.followUp({ content: "❌ No selection was made in time. Please try again.", ephemeral: true });
        }
    },
};
