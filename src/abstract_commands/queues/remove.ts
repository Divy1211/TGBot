import {Queue} from "../../entities/queues/Queue";

/**
 * Remove all users from all queues in the given server
 * @param guildId The id of the server in which the queues must be emptied
 */
export async function removeAll (guildId: string): Promise<string> {
    const queues = await Queue.find({
        where: {
            guild: {id: guildId},
        },
    });

    for (const queue of queues) {
        queue.users = [];
        await queue.save();
    }

    return "All users have been removed from all queues";
}
