import * as CONSTANTS from '.././api/constant.js'

function getRankForRating(rating) {
    for (const range of CONSTANTS.RATING_RANGE) {
        if (rating >= range.min && rating <= range.max) {
            return range.rank;
        }
    }
    return "Unknown Rank";
}

export default getRankForRating
