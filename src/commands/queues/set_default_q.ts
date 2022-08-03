import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {setDefaultQ} from "../../abstract_commands/queues/set_default_q";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "Set default join queue if there are multiple queues in a channel",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue to set as default",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, user} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const uuid = ensure(options.getInteger("queue_uuid"));

        return await setDefaultQ(user.id, channelId, guildId, uuid);
    },
} as ICommand;