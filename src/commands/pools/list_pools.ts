import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {listPools} from "../../abstract_commands/pools/list_pools";
import {generatePaginatedEmbed} from "../../utils/djs";

export default {
    category: "General",
    description: "List all the pools in the server",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "show_pool_ids",
            description: "If true, show the IDs of the pools. Default: true",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const showPoolIds = options.getBoolean("show_pool_ids") ?? true;

        await generatePaginatedEmbed(await listPools(guildId, showPoolIds), interaction);
    },
} as ICommand;