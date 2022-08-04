import {Pool} from "../../entities/pools/Pool";
import {Queue} from "../../entities/queues/Queue";

/**
 * Edit an existing queue by changing its name and numPlayers
 *
 * @param uuid
 * @param channelId The ID of the channel in which the queue should be edited
 * @param name
 * @param numPlayers The max number of players for the queue
 * @param poolUuid The ID of the pool to use for this queue
 */
export async function editQueue(
    uuid: number,
    channelId: string,
    {name, numPlayers, poolUuid}: {name?: string, numPlayers?: number, poolUuid?: number} = {},
): Promise<string> {
    let pool;
    if (poolUuid && poolUuid !== -1) {
        pool = await Pool.findOneBy({uuid: poolUuid});
        if (!pool) {
            return `Error: Pool with ID ${poolUuid} does not exist in this server`;
        }
    }

    let queue = await Queue.findOneBy({uuid, channelId});
    if (!queue) {
        return `The queue id ${uuid} does not exist in this channel`;
    }

    if (name) {
        queue.name = name;
    }
    if (numPlayers) {
        queue.numPlayers = numPlayers;
    }
    if(poolUuid === -1) {
        queue.pools = [];
    }
    if (pool) {
        queue.pools = [pool];
    }

    if (name || numPlayers || pool) {
        await queue.save();
    }

    return `Queue "${queue.name}" has been edited successfully!`;
}