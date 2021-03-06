import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {banUser} from "../../abstract_commands/ban/ban";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Ban a user",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to ban",
            type: ApplicationCommandOptionTypes.USER,
            required: true,
        },
        {
            name: "duration",
            description: "The duration to ban the user for",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "reason",
            description: "The reason for banning the user",
            type: ApplicationCommandOptionTypes.STRING,
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
        const user = ensure(options.getUser("user"));
        const duration = options.getString("duration") ?? "";
        const reason = options.getString("reason") ?? "";

        return await banUser(user.id, guildId, duration, reason);
    },
} as ICommand;
