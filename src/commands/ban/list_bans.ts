import {ICommand} from "wokcommands";

import {listBans} from "../../abstract_commands/ban/list_bans";

export default {
    category: "General",
    description: "List all the current queue bans on the server",

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

        return await listBans(guildId);
    },
} as ICommand;
