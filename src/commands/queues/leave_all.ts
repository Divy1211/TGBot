import {ICommand} from "wokcommands";
import {leaveAll} from "../../abstract_commands/queues/leave_all";

export default {
    category: "User",
    description: "Leave all queues",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {channelId, guildId, user} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        return await leaveAll(user.id, guildId);
    },
} as ICommand;