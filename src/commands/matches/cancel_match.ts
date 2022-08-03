import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {cancelMatch} from "../../abstract_commands/matches/cancel";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Cancel the result of a match",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "match_uuid",
            description: "The id of the match to cancel",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "user",
            description: "If specified, only this user will be removed from the queue",
            type: ApplicationCommandOptionTypes.USER,
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
        const uuid = ensure(options.getInteger("match_uuid"));
        const user = options.getUser("user");

        if (user) {
            return await cancelMatch(guildId, uuid, [user.id]);
        }

        return await cancelMatch(guildId, uuid);
    },
} as ICommand;
