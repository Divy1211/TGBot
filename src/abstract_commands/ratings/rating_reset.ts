import {PlayerStats} from "../../entities/queues/PlayerStats";

/**
 * Reset the playerStats for the given user and the given queue. If no user is given, stats are reset for all users.
 * If no queue is given, stats are reset for all queues.
 *
 * @param guildId the ID of the guild in which to reset the ratings and stats
 * @param discordId The ID of the user to reset the ratings and stats in for
 * @param queueUuid The ID of the queue to reset the ratings and stats in
 */
export async function ratingReset(guildId: string, discordId?: string, queueUuid?: number): Promise<string> {

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
    await PlayerStats.remove(playerStats);

    let msg = (discordId ? `<@${discordId}>'s ` : `All players' `) + "statistics ";
    msg += (queueUuid ? `for queue with ID ${queueUuid} ` : `for all queues `) + `have been reset!`;

    return msg;
}