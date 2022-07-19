import {Guild} from "../../entities/Guild";
import {Leaderboard} from "../../entities/queues/Leaderboard";
import {Queue} from "../../entities/queues/Queue";

/**
 * Creates a queue with the given name and number of players, in the specified channel and server
 *
 * @param name
 * @param numPlayers The max number of players for the queue
 * @param guildId The ID of the server in which the queue should be created
 * @param channelId The ID of the channel in which the queue should be created
 */
export async function createQueue(
    name: string,
    numPlayers: number,
    guildId: string,
    channelId: string
): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const queue = new Queue(name, guild, new Leaderboard(guild), numPlayers, channelId);
    await queue.save();

    return `Queue "${name}" has been created successfully!`;
}