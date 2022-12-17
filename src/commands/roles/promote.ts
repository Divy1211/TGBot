import {ICommand} from "wokcommands";

import {promote} from "../../abstract_commands/roles/promote";

export default {
    category: "General",
    description: "If set, ping the promotion role for the server",

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

        return await promote(guildId);
    },
} as ICommand;
