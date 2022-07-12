import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {deleteQueue} from "../../abstract_commands/queues/delete";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Create a TG pickup queue in this channel",

    slash: true,
    testOnly: true,
    guildOnly: true,

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
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const uuid = ensure(options.getInteger("uuid"));

        return await deleteQueue(uuid, channelId);
    },
} as ICommand;
