import {Match} from "../../entities/matches/Match";
import {Queue} from "../../entities/queues/Queue";

/**
 * Deletes a queue with the given id
 *
 * @param uuid The ID of the queue to delete
 * @param channelId The ID of the channel to delete the queue in
 */
export async function deleteQueue(uuid: number, channelId: string): Promise<string> {
    let queue = await Queue.findOneBy({uuid, channelId});
    if (!queue) {
        return `Error: Queue with ID \`${uuid}\` was not found in this channel.`;
    }

    // do not allow deletion if a game is unfinished
    const matches = await Match.findBy({
        endTime: -1,
        queue: {uuid: queue.uuid}
    });
    if(matches.length > 0) {
        return `Error: Cannot delete queue when a match is being played in the queue.`;
    }

    await queue.remove();

    return `Queue "${queue.name}" with ID \`${uuid}\` has been deleted successfully!`;
}