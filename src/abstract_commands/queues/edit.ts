import {Queue} from "../../entities/queues/Queue";

/**
 * Edit an existing queue by changing its name and numPlayers
 *
 * @param uuid
 * @param name
 * @param numPlayers The max number of players for the queue
 * @param channelId The ID of the channel in which the queue should be edited
 */
export async function editQueue(uuid: number, name: string, numPlayers: number, channelId: string): Promise<string> {
    let queue = await Queue.findOneBy({uuid, channelId});
    if (!queue) {
        return `The queue id ${uuid} was not found in this channel`;
    }
    if (name) {
        queue.name = name;
    }
    if (numPlayers) {
        queue.numPlayers = numPlayers;
    }
    if (name || numPlayers) {
        await queue.save();
    }

    return `Queue "${queue.name}" has been edited successfully!`;
}