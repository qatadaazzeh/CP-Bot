import User from "../models/User.js";

export async function removeExpiredSubmissions() {
    const currentTime = Math.floor(Date.now() / 1000);
    try {

        const result = await User.deleteMany({
            "problem.timeUntil": { $lt: currentTime },
            valid: false
        });
        console.log(`Deleted ${result.deletedCount} expired submissions.`);
    } catch (error) {
        console.error("Error deleting expired submissions:", error);
    }
}


setInterval(removeExpiredSubmissions, 60 * 1000);