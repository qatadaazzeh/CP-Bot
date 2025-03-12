import schedule from 'node-schedule';
import * as CF_API from '../api/core.js';
import ratingRange from '../utils/rateRange.js';
import { EmbedBuilder } from 'discord.js';
import { ROLES } from '../api/constant.js';
import User from '../models/User.js';
import config from '../config.js';
import * as API from "../api/constant.js";
const DELAY_AFTER_CONTEST = 12 * 60 * 60 * 1000;

async function sendRatingChangeNotification(client) {
    const ratingChanges = await CF_API.getLastContest();
    if (!ratingChanges || ratingChanges.length === 0) {
        console.log('No rating changes available at this time.');
        return;
    }

    const usersDetails = [];

    for (const user of ratingChanges) {
        const delta = user.newRating - user.oldRating;
        const newRank = ratingRange(user.newRating)[0];
        const oldRank = ratingRange(user.oldRating)[0];
        const formattedRank = String(newRank).charAt(0).toUpperCase() + String(newRank).slice(1);
        const formattedOldRank = String(oldRank).charAt(0).toUpperCase() + String(oldRank).slice(1);
        const cf_user = await User.findOne({ handle: user.handle });
        if (cf_user) {
            const user_id = cf_user.token;
            const guild = client.guilds.cache.first();
            if (guild) {
                try {
                    const member = await guild.members.fetch(user_id);
                    if (oldRank && member.roles.cache.has(ROLES[oldRank])) {
                        await member.roles.remove(ROLES[oldRank]);
                    }
                    if (!member.roles.cache.has(ROLES[newRank])) {
                        await member.roles.add(ROLES[newRank]);
                    }
                } catch (error) {
                    console.error("Error updating roles for user", user_id, error);
                }
            }
        }
        usersDetails.push(`----------------------------------\n` +
            `**User Handle : ** \`${user.handle}\`\n\n` +
            `**Old Rating : ** \`${user.oldRating}\`\n\n` +
            `**New Rating : ** \`${user.newRating}\`\n\n` +
            `**User Delta : ** \`${delta}\`\n\n` +
            `**New Rank : ** \`${formattedRank}\`\n` +
            `**Old Rank : ** \`${formattedOldRank}\`\n` +
            `----------------------------------\n`);
    }

    const maxFieldLength = 1024;
    const fields = [];
    let currentField = '';
    usersDetails.forEach(detail => {
        if (currentField.length + detail.length > maxFieldLength) {
            fields.push(currentField);
            currentField = detail;
        } else {
            currentField += detail;
        }
    });
    if (currentField.length > 0) {
        fields.push(currentField);
    }

    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`Rating Change for ${ratingChanges[0].contestName || 'the last contest'}`)
        .setDescription("Here is the Rating Change List:")
        .setFooter({ text: `Rating Change Notification`, iconURL: config.embedFooter })
        .setTimestamp();

    fields.forEach((fieldValue, index) => {
        embed.addFields({ name: `Rating Change Part ${index + 1}`, value: fieldValue });
    });

    try {
        const channel = await client.channels.fetch(config.ratingChangeChannel);
        if (channel) {
            channel.send({ embeds: [embed] });
            console.log(`Rating change notification sent to channel ${config.ratingChangeChannel}`);
        }
    } catch (error) {
        console.error("Error sending rating change notification:", error);
    }
}

async function scheduleRatingChangeNotificationForNextContest(client) {
    const contestResp = await fetch(API.API.contest);
    if (!contestResp.ok) {
        console.error('Error fetching contests');
        return;
    }
    const contestsData = await contestResp.json();
    const ongoingContest = contestsData.result.find(contest => contest.phase === "CODING");
    if (!ongoingContest) {
        console.log('No ongoing contest found to schedule notification.');
        return;
    }
    const contestEndTime = new Date((ongoingContest.startTimeSeconds + ongoingContest.durationSeconds) * 1000);
    const notificationTime = new Date(contestEndTime.getTime() + DELAY_AFTER_CONTEST);
    const now = new Date();
    if (notificationTime <= now) {
        await sendRatingChangeNotification(client);
    } else {
        schedule.scheduleJob(notificationTime, async () => {
            console.log(`Contest ${ongoingContest.name} ended. Sending rating change notification after delay…`);
            await sendRatingChangeNotification(client);
        });
        console.log(`Scheduled rating change notification for contest "${ongoingContest.name}" at ${notificationTime}`);
    }
}

function scheduleRatingChangeNotifications(client) {
    scheduleRatingChangeNotificationForNextContest(client)
        .catch(err => console.error("Error scheduling contest notification:", err));
}

export { scheduleRatingChangeNotifications };