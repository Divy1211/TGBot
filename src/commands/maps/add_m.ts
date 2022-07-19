import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {addMap} from "../../abstract_commands/maps/add_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Add a map into a pool",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "map_name",
            description: "The name of the map",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "pool_name",
            description: "The name of the pool",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "multiplier",
            description: "The number of players for this map",
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
        const map_name = ensure(options.getString("map_name"));
        const pool_name = ensure(options.getString("pool_name"));
        const multiplier = ensure(options.getInteger("multiplier"));

        return await addMap(map_name, pool_name, multiplier, guildId);
    },
} as ICommand;