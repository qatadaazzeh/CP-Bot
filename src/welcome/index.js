import {
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Events,
    Client,
    GatewayIntentBits,
} from "discord.js";
import config from "../config.js";
import Canvas from "canvas";
import editor from "editor-canvas";
import { Database, JSONDriver } from "st.db";


const db = new Database({ driver: new JSONDriver("./data.json") });



export async function createWelcome(
    avatarX,
    avatarY,
    avatarWidth,
    avatarHeight,
    avatarUrl,
    usernameTextX = 50,
    usernameTextY = 50,
    username = ""
) {
    const background = await Canvas.loadImage(config.welcomeimage);
    const canvas = Canvas.createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const processedAvatar = await editor.drawCircle({ image: avatarUrl });
    const loadedAvatar = await Canvas.loadImage(processedAvatar);
    ctx.drawImage(loadedAvatar, avatarX, avatarY, avatarWidth, avatarHeight);

    ctx.textAlign = "center";
    ctx.fillStyle = "WHITE";
    ctx.font = "70px Arial";
    ctx.fillText(username, usernameTextX, usernameTextY);

    return new AttachmentBuilder(canvas.toBuffer(), { name: "welcome.png" });
}

export function initWelcome(client) {
    console.log("Initializing welcome module...");

    client.on(Events.GuildMemberAdd, async (member) => {
        const channel = member.guild.channels.cache.get(config.welcomechannel);
        if (!channel) return;

        const msgText = config.welcomemsg
            .replace("{user}", `<@${member.user.id}>`)
            .replace("{inviter}", "Unknown")
            .replace("{server}", member.guild.name);

        let avatarUrl = member.user.displayAvatarURL();
        avatarUrl = avatarUrl.replace(/\.(webp|jpg)$/, ".png");
        const attachment = await createWelcome(
            (await db.get(`avatarX_${member.guild.id}`)) ?? 180,
            (await db.get(`avatarY_${member.guild.id}`)) ?? 240,
            (await db.get(`avatarWidth_${member.guild.id}`)) ?? 388,
            (await db.get(`avatarHeight_${member.guild.id}`)) ?? 388,
            avatarUrl,
            (await db.get(`usernameTextX_${member.guild.id}`)) ?? 50,
            (await db.get(`usernameTextY_${member.guild.id}`)) ?? 50,
            member.user.username
        );

        await channel.send({ files: [attachment], content: msgText });
    });

    client.on(Events.MessageCreate, async (message) => {
        if (message.author.bot || !message.guild) return;
        if (!message.content.startsWith(config.prefix + "setwelcome")) return;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("avatarX_increase").setLabel("Right").setStyle(1),
            new ButtonBuilder().setCustomId("avatarX_decrease").setLabel("Left").setStyle(1),
            new ButtonBuilder().setCustomId("avatarY_increase").setLabel("Down").setStyle(1),
            new ButtonBuilder().setCustomId("avatarY_decrease").setLabel("Up").setStyle(1),
            new ButtonBuilder().setCustomId("size_increase").setLabel("Bigger").setStyle(1),
        );

        const rowSecondary = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("size_decrease").setLabel("Smaller").setStyle(1),
            new ButtonBuilder().setCustomId("done").setLabel("Done").setStyle(1),
            new ButtonBuilder().setCustomId("set_adjustment").setLabel("Set Adjustment Value").setStyle(1)
        );
        const ThirdRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("textX_increase").setLabel("Text Right").setStyle(1),
            new ButtonBuilder().setCustomId("textX_decrease").setLabel("Text Left").setStyle(1),
            new ButtonBuilder().setCustomId("textY_increase").setLabel("Text Up").setStyle(1),
            new ButtonBuilder().setCustomId("textY_decrease").setLabel("Text Down").setStyle(1)
        )

        let avatarUrl = message.author.displayAvatarURL();
        avatarUrl = avatarUrl.replace(/\.(webp|jpg)$/, ".png");
        const welcomeAttachment = await createWelcome(
            (await db.get(`avatarX_${message.guild.id}`)) ?? 180,
            (await db.get(`avatarY_${message.guild.id}`)) ?? 240,
            (await db.get(`avatarWidth_${message.guild.id}`)) ?? 388,
            (await db.get(`avatarHeight_${message.guild.id}`)) ?? 388,
            avatarUrl,
            (await db.get(`usernameTextX_${message.guild.id}`)) ?? 50,
            (await db.get(`usernameTextY_${message.guild.id}`)) ?? 50,
            message.author.username
        );

        const sentMessage = await message.reply({
            content: "Updated File",
            files: [welcomeAttachment],
            components: [row, rowSecondary, ThirdRow]
        });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 300000 });
        let adjustmentValue = (await db.get(`adjustmentValue_${message.guild.id}`)) ?? config.count;

        collector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "avatarX_increase":
                    await db.math(`avatarX_${message.guild.id}`, "+", adjustmentValue);
                    break;
                case "avatarX_decrease":
                    await db.math(`avatarX_${message.guild.id}`, "-", adjustmentValue);
                    break;
                case "avatarY_increase":
                    await db.math(`avatarY_${message.guild.id}`, "+", adjustmentValue);
                    break;
                case "avatarY_decrease":
                    await db.math(`avatarY_${message.guild.id}`, "-", adjustmentValue);
                    break;
                case "textX_increase":
                    await db.math(`usernameTextX_${message.guild.id}`, "+", adjustmentValue);
                    break;
                case "textX_decrease":
                    await db.math(`usernameTextX_${message.guild.id}`, "-", adjustmentValue);
                    break;
                case "textY_increase":
                    await db.math(`usernameTextY_${message.guild.id}`, "+", adjustmentValue);
                    break;
                case "textY_decrease":
                    await db.math(`usernameTextY_${message.guild.id}`, "-", adjustmentValue);
                    break;
                case "size_increase":
                    await db.math(`avatarWidth_${message.guild.id}`, "+", adjustmentValue);
                    await db.math(`avatarHeight_${message.guild.id}`, "+", adjustmentValue);
                    break;
                case "size_decrease":
                    await db.math(`avatarWidth_${message.guild.id}`, "-", adjustmentValue);
                    await db.math(`avatarHeight_${message.guild.id}`, "-", adjustmentValue);
                    break;
                case "done":
                    collector.stop();
                    break;
                case "set_adjustment":
                    const modal = new ModalBuilder()
                        .setCustomId("adjustmentModal")
                        .setTitle("Set Adjustment Value")
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("adjustmentInput")
                                    .setLabel("Adjustment Value")
                                    .setStyle(TextInputStyle.Short)
                            )
                        );
                    await interaction.showModal(modal);
                    return;
            }
            await interaction.reply({ content: "Updated!", ephemeral: true });
            const updatedAttachment = await createWelcome(
                (await db.get(`avatarX_${message.guild.id}`)) ?? 180,
                (await db.get(`avatarY_${message.guild.id}`)) ?? 240,
                (await db.get(`avatarWidth_${message.guild.id}`)) ?? 388,
                (await db.get(`avatarHeight_${message.guild.id}`)) ?? 388,
                avatarUrl,
                (await db.get(`usernameTextX_${message.guild.id}`)) ?? 50,
                (await db.get(`usernameTextY_${message.guild.id}`)) ?? 50,
                message.author.username
            );
            await sentMessage.edit({ files: [updatedAttachment] });
        });
    });

    client.on(Events.ClientReady, () => {
        console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    });
}