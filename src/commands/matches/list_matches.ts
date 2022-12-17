import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {listMatches} from "../../abstract_commands/matches/list_matches";

export default {
    category: "General",
    description: "List all the matches in the server",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "show_match_ids",
            description: "If true, show the IDs of the matches. Default: false",
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
        const showMatchIds = options.getBoolean("show_match_ids") ?? false;

        return await listMatches(guildId, showMatchIds);
    },
} as ICommand;