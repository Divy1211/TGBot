import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {listMaps} from "../../abstract_commands/pools/list_maps";

export default {
    category: "General",
    description: "List all the maps on the server, or all the maps of a specific pool",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "pool_uuid",
            description: "If specified, only list the maps of this pool",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
            minValue: 1
        },
        {
            name: "show_pool_ids",
            description: "show the IDs of all the pools that use this map",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        }
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;
        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }
        // get the command parameters
        const poolUuid = options.getInteger("pool_uuid") ?? 0;
        const showPoolIds = options.getBoolean("show_pool_ids") ?? false;

        return listMaps(poolUuid, showPoolIds, guildId);
    }
} as ICommand;