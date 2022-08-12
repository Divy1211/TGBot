import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {deletePool} from "../../abstract_commands/pools/delete_pool";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Delete a pool from the server",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "pool_uuid",
            description: "The uuid of the pool to remove",
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
        const poolUuid = ensure(options.getInteger("pool_uuid"));

        return await deletePool(poolUuid, guildId);
    },
} as ICommand;