import {MessageEmbed} from "discord.js";

import {Queue} from "../../entities/queues/Queue";
import {User} from "../../entities/User";

/**
 * Removes the given user from a queue in the given channel or the specified queue
 *
 * @param discordId The discord ID of the user trying to leave a queue
 * @param channelId The ID of the channel in which this command is used
 * @param guildId The ID of the server in which this command is used
 * @param uuid The ID of the queue to leave
 */
export async function leaveQueue(
    discordId: string,
    channelId: string,
    guildId: string,
    uuid?: number,
): Promise<string | MessageEmbed> {

    // a user is created when they join a queue, so if the user is not found,
    // that means that they are not in a queue
    let user = await User.findOneBy({discordId});
    if (!user) {
        return "You are not in any queues";
    }


    // If the uuid is provided, load that queue. If not,
    // load all the queues in the channel that this command is run.
    // If there are no queues, return.
    // If there is just one queue, use that as the queue
    // If there are more than 1 queues and the user is in only one of them, leave that queue
    // If the user is in more than one queue, return

    let queue;
    if (uuid) {
        queue = await Queue.findOneBy({uuid, channelId});
        if (!queue) {
            return `Error: Queue with ID ${uuid} does not exist in this channel`;
        }
    } else {
        const queues = await Queue.findBy({channelId});

        if (queues.length === 0) {
            return "You are not in any queues";
        } else if (queues.length > 1) {
            for (const leaveQueue of queues) {
                if (leaveQueue.users.map(({discordId}) => discordId).includes(discordId)) {
                    if (!queue) {
                        queue = leaveQueue;
                    } else {
                        return "You are in multiple queues, please specify which queue you wish to leave";
                    }
                }
            }
            if (!queue) {
                return "You are not in any queues";
            }
        } else {
            queue = queues[0];
        }
    }

    if (!queue.users.map(({discordId}) => discordId).includes(user.discordId)) {
        return "You are not in any queues";
    }

    queue.users = queue.users.filter((user) => user.discordId != discordId);
    await queue.save();

    return queue.getPlayerEmbed();
}