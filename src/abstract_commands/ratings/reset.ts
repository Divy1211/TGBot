import {PlayerStats} from "../../entities/queues/PlayerStats";

/**
 * Reset the playerStats for the given user and the given queue. If no user is given, stats are reset for all users.
 * If no queue is given, stats are reset for all queues.
 *
 * @param guildId the ID of the guild in which to reset the ratings and stats
 * @param discordId The ID of the user to reset the ratings and stats in for
 * @param queueUuid The ID of the queue to reset the ratings and stats in
 * @param rating If true, resets the ratings
 * @param stats If true, resets statistics
 */
export async function reset(guildId: string, discordId?: string, queueUuid?: number, {rating, stats}: {rating?: boolean, stats?: boolean} = {}): Promise<string> {

    // if one of the parameters is undefined, that filter is ignored
    const playerStats = await PlayerStats.find({
        where: {
            leaderboard: {
                queue: {uuid: queueUuid},
                guild: {id: guildId},
            },
            user: {discordId},
        },
    });

    for(const playerStat of playerStats) {
        if(rating) {
            playerStat.rating = 1000;
            playerStat.sigma = 200;
        }
        if(stats) {
            playerStat.numGames = 0;
            playerStat.numLosses = 0;
            playerStat.numWins = 0;
            playerStat.streak = 0;
        }
        await playerStat.save();
    }

    let msg = discordId    ? `<@${discordId}>'s ` : `All players' `;
    msg += rating          ? "ratings " : "";
    msg += rating && stats ? "and " : "";
    msg += stats           ? "statistics " : "";
    msg += (queueUuid      ? `for queue with ID ${queueUuid} ` : `for all queues `) + `have been reset!`;

    return msg;
}