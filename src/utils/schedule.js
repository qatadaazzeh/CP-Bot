import schedule from 'node-schedule';
import * as CF_API from '../api/core.js';
import { EmbedBuilder } from 'discord.js';

const CHANNEL_ID = '1347315347535036500';

async function scheduleUpcomingContests(client) {
    if (!client) {
        console.error("Invalid client provided to scheduleUpcomingContests");
        return;
    }
    console.log("Scheduling upcoming contest reminders...");
    const contests = await CF_API.get_contests();
    if (!contests || contests.length === 0) return;

    const now = new Date();
    const upcomingContests = contests.filter(contest => {
        const contestStart = new Date(contest.startTimeSeconds * 1000);
        return contestStart > now;
    });


    function scheduleMessage(scheduledTime, message) {
        if (scheduledTime > now) {
            schedule.scheduleJob(scheduledTime, async () => {
                try {
                    const channel = await client.channels.fetch(CHANNEL_ID);
                    const embed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle("Upcoming Contest Reminder")
                        .setTimestamp();

                    const maxFieldLength = 1024;
                    if (message.length <= maxFieldLength) {
                        embed.addFields({ name: "Reminder", value: message });
                    } else {
                        const fields = [];
                        let currentField = "";
                        for (let i = 0; i < message.length; i++) {
                            currentField += message[i];
                            if (currentField.length === maxFieldLength) {
                                fields.push(currentField);
                                currentField = "";
                            }
                        }
                        if (currentField.length > 0) {
                            fields.push(currentField);
                        }
                        fields.forEach((text, index) => {
                            embed.addFields({ name: `Reminder Part ${index + 1}`, value: text });
                        });
                    }

                    await channel.send({
                        content: "@everyone CONTESTS Reminder: If you participate you will become (Zlamyy)",
                        embeds: [embed]
                    });

                } catch (err) {
                    console.error("Error sending reminder:", err);
                }
            });
        }
    }


    upcomingContests.forEach(contest => {
        const startTime = new Date(contest.startTimeSeconds * 1000);

        scheduleMessage(
            new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
            `**${contest.name}**\n\n**will start in 1 day.**\n\n**Register Link:** https://codeforces.com/contests/${contest.id}`
        );
        scheduleMessage(
            new Date(startTime.getTime() - 60 * 60 * 1000),
            `**${contest.name}**\n\n**Will start in 1 hour.**\n\n**Register Link:** https://codeforces.com/contests/${contest.id}`
        );
        scheduleMessage(
            new Date(startTime.getTime() - (10 * 60 * 60 * 1000 + 0 * 60 * 1000)),
            `**${contest.name}**\n\n**Will start in 10 hours and 3 minutes.**\n\n**Register Link:** https://codeforces.com/contests/${contest.id}`
        );
        scheduleMessage(
            startTime,
            `The contest **${contest.name}** \n\n**is starting now!**\n\n**Register Link:** https://codeforces.com/contests/${contest.id}`
        );
    });
}


schedule.scheduleJob('* * * * *', async () => {
    await scheduleUpcomingContests(global.client);
});

export { scheduleUpcomingContests };