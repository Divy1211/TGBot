import {MessageEmbed} from "discord.js";

import {Guild} from "../../entities/Guild";
import {Queue} from "../../entities/queues/Queue";
import {QueueDefault} from "../../entities/queues/QueueDefault";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";
import {getPlayerEmbed} from "../common";
import {startMatch} from "../matches/start";


/**
 * Puts the given user into a queue in the given channel or the specified queue
 *
 * @param discordId The discord ID of the user trying to join a queue
 * @param channelId The ID of the channel in which this command is used
 * @param guildId The ID of the server in which this command is used
 * @param uuid The ID of the queue to join
 * @param bypassBan If true, bypasses a ban if any on joining the queue
 */
export async function joinQueue(
    discordId: string,
    channelId: string,
    guildId: string,
    uuid?: number,
    bypassBan: boolean = false,
): Promise<string | MessageEmbed> {

    // load existing or create a new user
    let user = await User.findOneBy({discordId});
    if (!user) {
        // a guild is created when a queue is created, so if the guild is not created
        // that means that there is no queue either, since guilds can't be deleted
        const guild = await Guild.findOneBy({id: guildId});
        if (!guild) {
            return "There are no queues in this channel. Ask an admin to create one using /create_q!";
        }

        user = new User(discordId, {guilds: [guild]});
        await user.save();
    }

    if (user.inGame) {
        return "You cannot join a queue while in a game";
    }

    if(!bypassBan) {
        const ban = await Ban.findOne({where: {user: {discordId}, guild: {id: guildId}}});
        if (ban) {
            if (ban.until !== -1 && ban.until < Date.now() / 1000) {
                await ban.remove();
            } else if (ban.until !== -1) {
                return `You are banned from joining a queue${ban.reason ? ` for "${ban.reason}"` : ``} until <t:${ban.until}> which is <t:${ban.until}:R>`;
            } else {
                return `You are banned from joining a queue permanently${ban.reason ? ` for "${ban.reason}"` : ``}`;
            }
        }
    }

    // load existing or create a new QueueDefault
    let qDefault = await QueueDefault.findOneBy({channelId, user: {discordId}});
    if (!qDefault) {
        qDefault = new QueueDefault(user, channelId);
        await qDefault.save();
    }

    // If the uuid is provided, load that queue. If not,
    // load all the queues in the channel that this command is run.
    // If there are no queues, return.
    // If there is just one queue, use that as the queue
    // If there are more than 1 queues, check the QueueDefault for the user and channel.
    // If there is no QueueDefault, return
    // If there is a queue default, use it as the queue

    let queue;
    if (uuid) {
        queue = await Queue.findOneBy({uuid, channelId});
        if (!queue) {
            return `Queue with ID ${uuid} does not exist in this channel`;
        }
    } else {
        const queues = await Queue.findBy({channelId});

        if (queues.length === 0) {
            return "There are no queues in this channel. Ask an admin to create one using /create_q!";
        } else if (queues.length > 1) {
            if (qDefault.defaultQ) {
                queue = qDefault.defaultQ;
            } else if (qDefault.lastQ) {
                queue = qDefault.lastQ;
            } else {
                return "There are multiple queues in this channel, please specify the ID of the queue that you wish to join.";
            }
        } else {
            queue = queues[0];
        }
    }

    if (queue.users.map(({discordId}) => discordId).includes(user.discordId)) {
        return "You are already in the queue!";
    }

    qDefault.lastQ = queue;
    await qDefault.save();

    queue.users.push(user);

    if (queue.users.length === queue.numPlayers) {
        startMatch(queue.uuid, queue.users).then();
        queue.users = [];
    }

    await queue.save();

    return getPlayerEmbed(queue);
}