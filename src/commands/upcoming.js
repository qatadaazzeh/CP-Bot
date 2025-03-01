const { SlashCommandBuilder } = require("discord.js");
const STATUS = new Map();
STATUS.set('CODING', 'RUNNING');
STATUS.set('BEFORE', 'UPCOMING');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("contests")
        .setDescription("Return List of Upcoming Events"),

    async execute(interaction) {
        const request = await fetch('https://codeforces.com/api/contest.list');
        if (request.ok) {
            const Contests = await request.json();
            const filteredContests = Contests.result.filter((contest) => STATUS.has(contest.phase));
            console.log(filteredContests)
        }
        await interaction.reply('Hi')
    },
};
