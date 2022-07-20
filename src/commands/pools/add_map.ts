import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {addMap} from "../../abstract_commands/pools/add_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Add a map to a pool",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "map_uuid",
            description: "The uuid of the map",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "pool_uuid",
            description: "The uuid of the pool",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "multiplier",
            description: "The number of players for this map",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        const map_name = ensure(options.getInteger("map_uuid"));
        const pool_uuid = ensure(options.getInteger("pool_uuid"));
        const multiplier = options.getInteger("multiplier") ?? 1;

        return await addMap(map_name, pool_uuid, multiplier, guildId);
    },
} as ICommand;