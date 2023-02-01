import {MessageEmbed} from "discord.js";

import {Queue} from "../../entities/queues/Queue";

/**
 * Shows the players who are in a queue in the given channel or the specified queue
 *
 * @param channelId The ID of the channel in which this command is used
 * @param uuid The ID of the queue to join
 */
export async function listPlayers (channelId: string,
    uuid?: number): Promise<string | MessageEmbed> {
    // If the uuid is provided, load that queue. If not,
    // load all the queues in the channel that this command is run.
    // If there are no queues, return.
    // If there is just one queue, use that as the queue
    // If there are more than 1 queues return

    let queue;
    if (uuid) {
        queue = await Queue.findOneBy({uuid, channelId});
        if (!queue) {
            return `Error: Queue with ID ${uuid} does not exist in this channel`;
        }
    } else {
        const queues = await Queue.findBy({channelId});

        if (queues.length === 0) {
            return "There are no queues in this channel. Ask an admin to create one using /create_q!";
        } else if (queues.length > 1) {
            return "There are multiple queues in this channel, please specify which queue to show the players for.";
        } else {
            queue = queues[0];
        }
    }

    return queue.getPlayerEmbed();
}
