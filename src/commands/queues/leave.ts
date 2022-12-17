import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {leaveQueue} from "../../abstract_commands/queues/leave";
import {User} from "../../entities/User";

export default {
    category: "User",
    description: "Leave a queue",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue to leave",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: "user",
            description: "Make this user leave the queue",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        let {user} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const uuid = options.getInteger("queue_uuid") ?? undefined;
        user = options.getUser("user") ?? user;

        return await leaveQueue(user.id, channelId, guildId, uuid);
    },
} as ICommand;
