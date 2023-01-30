import {Match} from "../../entities/matches/Match";
import {Player} from "../../entities/matches/Player";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import {User} from "../../entities/User";
import {client} from "../../main";
import {ensure} from "../../utils/general";
import {startMatch} from "./start";

/**
 * Cancels the specified match and removes the specified users from the match from the queue if it is ongoing
 *
 * @param guildId The ID of the server that the command is run in
 * @param uuid The uuid of the match to cancel
 * @param userIdsToRemove The IDs of the users to remove from the queue if the match was ongoing
 */
export async function cancelMatch (guildId: string, uuid: number, userIdsToRemove?: string[]): Promise<string> {
    const match = await Match.findOne({
        where: {
            uuid,
            guild: {id: guildId},
        },
        relations: {
            queue: {users: true},
            players: {user: true},
            leaderboard: true,
        },
    });

    if (!match) {
        return `Error: Match with ID \`${uuid}\` does not exist in this server`;
    }

    const playerUsers = ensure(match.players).map((player: Player) => ensure(player.user));

    for (const user of playerUsers) {
        user.inGame = false;
        await user.save();
    }

    // this is irrelevant if the match is over
    if (match.endTime === -1 && userIdsToRemove) {
        const queue = ensure(match.queue);

        // remove the users specified from the players of the match and re-add the rest to the queue
        const users = playerUsers.filter((user: User) => !userIdsToRemove.includes(user.discordId));
        users.push(...queue.users);

        queue.users = users;

        // if the number of users in the queue is > queue.numPlayers then start a match
        if (queue.users.length >= queue.numPlayers) {
            startMatch(queue.uuid, queue.users.slice(0, queue.numPlayers)).then();
            queue.users = queue.users.slice(queue.numPlayers);
        }

        await queue.save();

        const channel = await client.channels.fetch(queue.channelId);
        if (channel?.isText()) {
            channel.send({embeds: [queue.getPlayerEmbed(), ]}).then();
        }
    }

    // only rollback stats if the match is over
    if (match.endTime !== -1) {
        for (const player of ensure(match.players)) {
            // a player stats object must have been created before the start of the match
            PlayerStats.findOneBy({
                user: {discordId: ensure(player.user).discordId},
                leaderboard: {uuid: ensure(match.leaderboard).uuid},
            }).then(async (stats: PlayerStats | null) => {
                // take back elo won (or give back elo lost, which is negative)
                ensure(stats).rating -= player.ratingDelta;
                await ensure(stats).save();
            });
        }
    }

    await match.remove();
    return `Match ${uuid} cancelled successfully.`;
}
