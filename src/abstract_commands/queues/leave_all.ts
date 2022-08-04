import {MessageEmbed} from "discord.js";

import {Queue} from "../../entities/queues/Queue";

/**
 * Removes the given user from all queues in the server
 *
 * @param discordId The discord ID of the user trying to leave all queues
 * @param guildId The ID of the server in which this command is used in
 */
export async function leaveAll(
    discordId: string,
    guildId: string,
): Promise<string | MessageEmbed> {
    let queues = await Queue.findBy({
        guild: {id: guildId},
        users: {discordId},
    });

    for (let queue of queues) {
        if (queue.users.map(({discordId}) => discordId).includes(discordId)) {
            queue.users = queue.users.filter((user) => user.discordId != discordId);
            await queue.save();
        }
    }

    return "You have left all queues";
}