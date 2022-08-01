import {gunzip} from "zlib";
import list_players from "../../commands/queues/list_players";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import {Queue} from "../../entities/queues/Queue";
import {User} from "../../entities/User";
import {ensure} from "../../utils/general";


/**
 * Reset ratings for playerStats
 *
 * @param discordId The ID of the user to set the rating for
 * @param rating The new rating of the user
 * @param channelId The ID of the channel the command is run in
 * @param queueUuid The ID of the queue to set the rating for
 */
export async function ratingSet(
    discordId: string,
    rating: number,
    channelId: string,
    queueUuid?: number,
): Promise<string> {

    const queues = await Queue.find({
        where: {
            uuid: queueUuid,
            channelId,
        },
        relations: {
            leaderboard: {
                playerStats: {
                    user: true,
                },
            },
        },
    });

    if (queues.length === 0) {
        return "There are no queues in this channel. Ask an admin to create one using /create_q!";
    }

    if (queues.length > 1) {
        return "There is more than one queue in this channel, please specify the ID of the queue to set the rating for.";
    }

    const queue = queues[0];
    let stats = ensure(queue.leaderboard?.playerStats)
        .find((playerStats: PlayerStats) => playerStats.user.discordId === discordId);

    if(stats) {
        stats.rating = rating;
        stats.sigma = 200;
    } else {
        let user = await User.findOneBy({discordId});
        if (!user) {
            user = new User(discordId);
            await user.save();
        }
        stats = new PlayerStats(user, ensure(queue.leaderboard));
    }

    await stats.save();
    return `<@${discordId}>'s rating has been set to ${rating}`;
}