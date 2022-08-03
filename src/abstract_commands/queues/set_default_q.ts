import {Queue} from "../../entities/queues/Queue";
import {QueueDefault} from "../../entities/queues/QueueDefault";
import {User} from "../../entities/User";


/**
 * Sets the default queue in a channel for a user
 *
 * @param discordId The ID of the user to set the default for
 * @param channelId The ID of the channel to set the default in
 * @param guildId The ID of the server to set the default in
 * @param queueUuid The ID of the queue to set as default
 */
export async function setDefaultQ(
    discordId: string,
    channelId: string,
    guildId: string,
    queueUuid: number,
): Promise<string> {
    const queue = await Queue.findOneBy({
        uuid: queueUuid,
        guild: {id: guildId},
    });

    if (!queue) {
        return `Error: The queue with ID ${queueUuid} does not exist in this channel`;
    }

    let qDefault = await QueueDefault.findOneBy({
        user: {discordId},
        channelId,
    });

    if (!qDefault) {
        let user = await User.findOneBy({discordId});
        if (!user) {
            user = new User(discordId);
            await user.save();
        }
        qDefault = new QueueDefault(user, channelId);
    }

    qDefault.defaultQ = queue;
    await qDefault.save();

    return `<@${discordId}>'s default join queue for this channel set to "${queue.name}"`;
}