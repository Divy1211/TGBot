import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {showMap} from "../../abstract_commands/pools/show_map";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "Show stats of a map",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "map_uuid",
            description: "The uuid of the map to show",
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
        const mapUuid = ensure(options.getInteger("map_uuid"));

        return await showMap(mapUuid, guildId);
    },
} as ICommand;