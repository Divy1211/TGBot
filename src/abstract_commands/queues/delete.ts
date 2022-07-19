import {Queue} from "../../entities/queues/Queue";

/**
 * Deletes a queue with the given id
 *
 * @param uuid The ID of the queue to delete
 * @param channelId The ID of the channel to delete the queue in
 */
export async function deleteQueue(uuid: number, channelId: string): Promise<string> {
    // todo: roles
    // todo: do not allow queue to be deleted while match ongoing (same w leaderboard)
    let queue = await Queue.findOneBy({uuid, channelId});

    if (!queue) {
        return `Queue with ID \`${uuid}\` was not found in this channel`;
    }

    await queue.remove();

    return `Queue "${queue.name}" with ID \`${uuid}\` has been deleted successfully!`;
}