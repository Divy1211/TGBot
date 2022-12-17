import {GuildMember} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {report} from "../../abstract_commands/matches/report";

export default {
    category: "Moderator",
    description: "Report a won game",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "match_uuid",
            description: "The id of the match",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: "team",
            description: "The team that won",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, user, member} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const matchUuid = options.getInteger("match_uuid") ?? undefined;
        const team = options.getInteger("team") ?? undefined;

        try {
            return await report(user.id, channelId, member as GuildMember, matchUuid, team, true);
        } catch (e) {
            return "Error: API Error";
        }
    },
} as ICommand;
