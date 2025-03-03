import schedule from 'node-schedule';
import * as CF_API from '../api/core.js';

async function scheduleReminders() {
    console.log("Sending")
    const contests = await CF_API.get_contests();
    console.log(contests, contests.length)
    if (!contests || contests.length === 0) return;

    const now = new Date();

    function scheduleMessage(scheduledTime, message) {

        if (scheduledTime > now) {
            schedule.scheduleJob(scheduledTime, () => {
                // client.channels.cache.get(CHANNEL_ID).send(message);
                console.log("Sending reminder:", message);
            });
        }
    }


    contests.forEach((contest) => {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        scheduleMessage(
            new Date(startTime.getTime() - 9 * 24 * 60 * 60 * 1000),
            `Reminder! ${contest.name} starts in 9 days.`
        );
        scheduleMessage(
            new Date(startTime.getTime() - 2 * 24 * 60 * 60 * 1000),
            `Reminder! ${contest.name} starts in 2 days.`
        );
        scheduleMessage(
            new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
            `Reminder! ${contest.name} starts in 1 day.`
        );
        scheduleMessage(
            new Date(startTime.getTime() - 5 * 60 * 60 * 1000),
            `Reminder! ${contest.name} starts in 5 hours.`
        );
        scheduleMessage(
            new Date(startTime.getTime() - 60 * 60 * 1000),
            `Reminder! ${contest.name} starts in 1 hour.`
        );
        scheduleMessage(
            startTime,
            `The contest ${contest.name} is starting now!`
        );
    });
}

// Schedule the reminder setup to run every hour.
schedule.scheduleJob('0 * * * *', scheduleReminders);

// Export the scheduleReminders function if needed elsewhere.
export { scheduleReminders };