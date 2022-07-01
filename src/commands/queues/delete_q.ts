import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {Queue} from "../../entities/queues/Queue";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Create a TG pickup queue in this channel",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "uuid",
            description: "The ID of the queue to delete",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        // get the command parameters
        const uuid = ensure(options.getInteger("uuid"));

        return await deleteQueue(uuid, channelId);
    },
} as ICommand;

/**
 * Deletes a queue with the given id
 *
 * @param uuid The ID of the queue to delete
 * @param channelId The ID of the channel to delete the queue in
 */
export async function deleteQueue(uuid: number, channelId: string): Promise<string> {
    let queue = await Queue.findOneBy({uuid, channelId});

    if (!queue)
        return `Queue with ID \`${uuid}\` was not found in this channel`;

    await queue.remove();

    return `Queue "${queue.name}" with ID \`${uuid}\` has been deleted successfully!`;
}