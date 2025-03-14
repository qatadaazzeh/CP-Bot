export const API = {
    user: 'http://codeforces.com/api/user.info?handles=',
    problem: 'https://codeforces.com/api/problemset.problems',
    contest: 'https://codeforces.com/api/contest.list?gym=false',
    userstat: 'https://codeforces.com/api/user.status?handle=',
    userRating: 'https://codeforces.com/api/user.rating?handle=',
    ratingChange: 'https://codeforces.com/api/contest.ratingChanges?contestId='
};

export const CONTEST_STATUS = {
    'CODING': 'RUNNING',
    'BEFORE': 'UPCOMING'
}
export const RANK_COLOR = {
    newbie: [128, 128, 128],
    pupil: [35, 145, 35],
    specialist: [37, 180, 171],
    expert: [0, 0, 255],
    candidate_master: [170, 0, 170],
    master: [255, 140, 0],
    international_master: [255, 140, 0],
    grandmaster: [255, 0, 0],
    international_grandmaster: [255, 0, 0],
    legendary_grandmaster: [255, 0, 0],
    headquarters: [0, 0, 0],
};


export const RATING_RANGE = [
    { min: 0, max: 1199, rank: "newbie" },
    { min: 1200, max: 1399, rank: "pupil" },
    { min: 1400, max: 1599, rank: "specialist" },
    { min: 1600, max: 1899, rank: "expert" },
    { min: 1900, max: 2099, rank: "candidate_master" },
    { min: 2100, max: 2299, rank: "master" },
    { min: 2300, max: 2399, rank: "international_master" },
    { min: 2400, max: 2599, rank: "grandmaster" },
    { min: 2600, max: 2999, rank: "international_grandmaster" },
    { min: 3000, max: Infinity, rank: "legendary_grandmaster" }
];
export const ROLES = {
    'unrated': "1349207301134876672",
    'newbie': "1349205740187025492",
    'pupil': "1349187229289025576",
    'specialist': "1349206163178393660",
    'expert': "1349206257545777263",
    'candidate_master': "1349206408834584678",
    'master': "1349206540359303228",
    'international_master': "1349206658529759304",
    'grandmaster': "1349207017394540604",
    'international_grandmaster': "1349207118397575199",
    'legendary_grandmaster': "1349207239092863016"
};