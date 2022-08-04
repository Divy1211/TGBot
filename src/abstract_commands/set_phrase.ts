import {Queue} from "../entities/queues/Queue";
import {QueueMsg} from "../entities/queues/QueueMsg";
import {User} from "../entities/User";

/**
 * Sets the phrase for a user when joining a queue
 *
 *@param discordId The ID of the user to set a phrase
 * @param guildId The ID of the server
 * @param queueUuid The ID of the queue that the phrase is set to
 * @param phrase The phrase to set
 */
export async function setPhrase(
    discordId: string,
    guildId: string,
    queueUuid: number,
    phrase: string,
): Promise<string> {
    let queue = await Queue.findOneBy({uuid: queueUuid, guild: {id: guildId}});
    if (!queue) {
        return `The queue id ${queueUuid} does not exist in this channel`;
    }

    let user = await User.findOneBy({discordId});
    if (!user) {
        user = new User(discordId);
        await user.save();
    }

    let queueMsg = new QueueMsg(user, queue, phrase);
    await queueMsg.save();
    return `<@${discordId}>'s phrase for queue with ID ${queueUuid} set to "${phrase}"`;
}