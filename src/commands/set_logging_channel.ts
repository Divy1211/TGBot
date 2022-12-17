import {ICommand} from "wokcommands";
import {setLoggingChannel} from "../abstract_commands/logging_channel";

export default {
    category: "Admin",
    description: "Set this channel as the logging channel for bot command usages on this server",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        return await setLoggingChannel(guildId, channelId);
    },
} as ICommand;