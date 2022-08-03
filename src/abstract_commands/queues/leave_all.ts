import {MessageEmbed} from "discord.js";
import {Queue} from "../../entities/queues/Queue";
import {User} from "../../entities/User";

/**
 * Removes the given user from all queues in the server
 *
 * @param discordId The discord ID of the user trying to leave a queue
 * @param guildId The ID of the server in which this command is used
 */
export async function leaveAll(
    discordId: string,
    guildId: string,
): Promise<string | MessageEmbed> {
    let user = await User.findOneBy({discordId});
    if (!user) {
        return "You are not in any queues";
    }

    let beRemoved = false;
    let queues = await Queue.findBy({guild: {id: guildId}});
    for (let queue of queues) {
        if (queue.users.map(({discordId}) => discordId).includes(discordId)) {
            queue.users = queue.users.filter((user) => user.discordId != discordId);
            await queue.save();
            beRemoved = true;
        }
    }

    if (beRemoved) {
        return "You have left all queues";
    } else {
        return "You are not in any queues";
    }
}