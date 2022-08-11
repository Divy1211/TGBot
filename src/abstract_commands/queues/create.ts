import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";
import {Leaderboard} from "../../entities/queues/Leaderboard";
import {Queue} from "../../entities/queues/Queue";

/**
 * Creates a queue with the given name and number of players, in the specified channel and server
 *
 * @param name
 * @param numPlayers The max number of players for the queue
 * @param guildId The ID of the server in which the queue should be created
 * @param channelId The ID of the channel in which the queue should be created
 * @param poolUuid The ID of the pool to be used by the queue
 */
export async function createQueue(
    name: string,
    numPlayers: number,
    guildId: string,
    channelId: string,
    poolUuid?: number,
): Promise<string> {
    let pool;
    if (poolUuid) {
        pool = await Pool.findOneBy({uuid: poolUuid});
        if (!pool) {
            return `Error: Pool with ID ${poolUuid} does not exist in this server`;
        }
    }

    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const queue = new Queue(name, guild, new Leaderboard(guild), numPlayers, channelId);

    if(pool) {
        queue.pools = [pool];
    }

    await queue.save();
    return `Queue "${name}" has been created successfully!`;
}