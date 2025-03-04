import * as API from "../api/constant.js";
import User from "../models/User.js";
export const get_contests = async function () {
    const request = await fetch(API.API.contest);
    if (request.ok) {
        const Contests = await request.json();
        const filteredContests = Contests.result.filter((contest) => API.CONTEST_STATUS.hasOwnProperty(contest.phase));
        return filteredContests;
    }
    return null;
};
export const getLastContest = async function () {
    const request = await fetch(API.API.contest);
    if (request.ok) {
        const Contests = await request.json();
        const finishedContests = Contests.result.filter(
            contest => contest.phase === "FINISHED" && !contest.name.includes("Unrated")
        );
        finishedContests.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
        if (finishedContests.length > 0) {
            const contestID = finishedContests[0].id;
            const contestChange = await fetch(API.API.ratingChange + contestID);
            if (contestChange.ok) {
                const jsonContests = await contestChange.json();
                const handles = jsonContests.result.map(user => user.handle);
                const validUserRecords = await User.find({ handle: { $in: handles }, valid: true });
                const validHandlesSet = new Set(validUserRecords.map(u => u.handle));

                const filteredContests = jsonContests.result.filter(user => validHandlesSet.has(user.handle));
                return filteredContests;
            } else {
                return null;
            }
        }
    }
    return null;
}
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
    if (Problems == null) return null;
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
    if (Problems == null) return null;
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


export const getUserRateChange = async function (handle) {
    const request = await fetch(API.API.userRating + handle);
    if (request.ok) {
        const Changes = await request.json();
        const freq = {};
        let last = 0;
        for (const change of Changes.result) {
            freq[change.contestName] = change.newRating
            last = change.newRating
        }
        return freq;
    }

    return null;
}


export const getUserRequest = async function (handle) {
    const request = await fetch(API.API.user + handle + '&checkHistoricHandles=false');
    return request.status;
}


export const getRandProblem = async function () {
    const request = await fetch(API.API.problem);
    if (request.ok) {
        const jsonReq = await request.json();
        const problems = jsonReq.result.problems;
        if (Array.isArray(problems) && problems.length > 0) {
            const randomIndex = Math.floor(Math.random() * problems.length);
            return problems[randomIndex];
        }
    }
    return null;
}



export const getCompiltionProblems = async function (handle, problemId) {
    const Problems = await get_userStat(handle)
    const CompileProblems = Problems.result.filter(
        problem =>
            problem.verdict === "COMPILATION_ERROR" && problem.problem.contestId === problemId
    );
    return CompileProblems
}