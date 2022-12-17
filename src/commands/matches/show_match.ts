import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {showMatch} from "../../abstract_commands/matches/show_match";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "Show the details of a specific match",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "match_uuid",
            description: "The id of the match to show",
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
        const uuid = ensure(options.getInteger("match_uuid"));

        return await showMatch(guildId, uuid);
    },
} as ICommand;
