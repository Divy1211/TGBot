import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {removeMap} from "../../abstract_commands/pools/remove_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Remove a map from a pool",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "map_uuid",
            description: "the uuid of the map",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "pool_uuid",
            description: "the uuid of the pool, if unspecified will remove it from all pools",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        const pool_uuid = options.getInteger("pool_uuid") ?? 0;
        const map_uuid = ensure(options.getInteger("map_uuid"));

        return await removeMap(map_uuid, pool_uuid, guildId);
    },
} as ICommand;