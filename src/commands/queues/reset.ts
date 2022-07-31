import {ICommand} from "wokcommands";
import { removeAll } from "../../abstract_commands/queues/remove";


export default {
    category: "Admin",
    description: "Remove all users from all queues",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        return await removeAll(guildId);
    },
} as ICommand;
