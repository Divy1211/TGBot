import {Match} from "../../entities/matches/Match";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import {Queue} from "../../entities/queues/Queue";
import {User} from "../../entities/User";
import {client} from "../../main";
import {ensure} from "../../utils/general";

/**
 * Puts the given user into a queue in the given channel or the specified queue
 *
 * @param uuid The ID queue to start the match in
 * @param users The users to start the match with
 */
export async function startMatch (uuid: number, users: User[]): Promise<void> {
    // this function should never be called with a queue uuid that is not in the DB
    const queue = ensure(await Queue.findOne({
        where: {uuid},
        relations: {
            leaderboard: true,
            pools: {poolMaps: true},
            guild: true,
        },
    }));

    if (ensure(queue.pools).length === 0) {
        const channel = await client.channels.fetch(queue.channelId);
        if (channel?.isText()) {
            await channel.send("Error: Unable to start game, there is no pool defined for the queue. Ask an admin to make one using /create_pool!");
            return;
        }
    }

    // create a list of statistics for the users, this is required for generating the match balance
    // if the stats for the user are not found in the db, they are initialised with default values
    const statslist: PlayerStats[] = [];
    for (const user of users) {
        let stats: PlayerStats | null;

        stats = await PlayerStats.findOne({
            where: {
                user: {discordId: user.discordId},
                leaderboard: {uuid: ensure(queue.leaderboard).uuid},
            },
            relations: {
                leaderboard: true,
            },
        });
        if (!stats) {
            stats = new PlayerStats(user, ensure(queue.leaderboard));
            await stats.save();
        }
        statslist.push(stats);
    }

    const match = new Match(statslist, queue);
    await match.save();

    match.setupVotingOptions().then();

    // set the inGame and currentMatch property for all the users
    // also remove them from all the other queues that they are in
    for (const {discordId} of users) {
        // this function must never be called with a user array containing user instances not present in the DB.
        const user = ensure(await User.findOne({where: {discordId}, relations: {queues: true}}));
        user.inGame = true;
        user.currentMatch = match;
        await user.save();

        for (const queue of ensure(user.queues)) {
            if (queue.uuid === uuid) {
                continue;
            }
            queue.users = queue.users.filter(user => user.discordId !== discordId);
            await queue.save();

            const channel = await client.channels.fetch(queue.channelId);
            if (channel?.isText()) {
                await channel.send({
                    content: `Removed <@${discordId}> from "${queue.name}" since their game started on another queue.`,
                    embeds: [queue.getPlayerEmbed(), ],
                });
            }
        }
    }
}
