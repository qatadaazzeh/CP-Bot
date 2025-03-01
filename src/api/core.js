import *  as API from "../api/constant.js";
export const get_contests = async function () {
    const request = await fetch(API.API.contest);
    if (request.ok) {
        const Contests = await request.json();
        const filteredContests = await Contests.result.filter((contest) => API.CONTEST_STATUS.hasOwnProperty(contest.phase));
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