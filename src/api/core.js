import * as API from "../api/constant.js";

export const get_contests = async function () {
    const request = await fetch(API.API.contest);
    if (request.ok) {
        const Contests = await request.json();
        const filteredContests = Contests.result.filter((contest) => API.CONTEST_STATUS.hasOwnProperty(contest.phase));
        return filteredContests;
    }
    return null;
};

export const get_user = async function (handle) {
    const request = await fetch(API.API.user + handle + '&checkHistoricHandles=false');
    if (request.ok) {
        const User = await request.json();
        return User;
    }
    return null;
};

const get_userStat = async function (handle) {
    const request = await fetch(API.API.userstat + handle);
    if (request.ok) {
        const User = await request.json();
        return User;
    }
    return null;
};

export const get_userAC = async function (handle) {
    const Problems = await get_userStat(handle);
    const freq = {};
    const ACProblems = Problems.result.filter(problem => problem.verdict === "OK" && problem.problem.hasOwnProperty("rating"));

    const uniqueProblems = [];
    const seen = new Set();

    for (const problem of ACProblems) {
        const key = problem.problem.name;
        if (!seen.has(key)) {
            uniqueProblems.push(problem);
            seen.add(key);

            const rating = problem.problem.rating;
            if (!freq[rating]) {
                freq[rating] = 0;
            }
            freq[rating]++;
        }
    }
    const sortedFreq = {};
    Object.keys(freq)
        .sort((a, b) => Number(a) - Number(b))
        .forEach(key => {
            sortedFreq[key] = freq[key];
        });

    return sortedFreq;
};




export const get_userTags = async function (handle) {
    const Problems = await get_userStat(handle);
    const ACProblems = Problems.result.filter(
        problem =>
            problem.verdict === "OK" &&
            problem.problem.hasOwnProperty("tags")
    );
    const freq = {};
    const seen = new Set();

    for (const problem of ACProblems) {
        const key = problem.problem.name;
        if (!seen.has(key)) {
            seen.add(key);
            const tags = problem.problem.tags;
            for (const tag of tags) {
                if (!freq[tag]) {
                    freq[tag] = 0;
                }
                freq[tag]++;
            }
        }
    }
    const sortedFreq = {};
    Object.entries(freq)
        .sort(([, aCount], [, bCount]) => bCount - aCount)
        .forEach(([tag, count]) => {
            sortedFreq[tag] = count;
        });

    console.log(sortedFreq);
    return sortedFreq;
};