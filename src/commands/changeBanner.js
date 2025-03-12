import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("change-banner")
        .setDescription("Change the bot's banner using an uploaded image (Admins only)")
        .addAttachmentOption(option =>
            option.setName("image")
                .setDescription("Upload the new banner image (jpg, jpeg, png, or gif)")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply();
        const attachment = interaction.options.getAttachment("image");
        if (!attachment) {
            return await interaction.editReply("Please upload an image.");
        }
        const cleanUrl = attachment.url.split('?')[0];

        if (!cleanUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return await interaction.editReply("Please upload a valid image (jpg, jpeg, png, or gif). ");
        }
        try {
            await interaction.client.user.setBanner(attachment.url);
            await interaction.editReply("Banner successfully updated!");
        } catch (error) {
            console.error("Error updating banner:", error);
            await interaction.editReply("An error occurred while updating the banner.");
        }
    },
};
