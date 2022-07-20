import {ICommand} from "wokcommands";
import {listPools} from "../../abstract_commands/pools/list_pools";

export default {
    category: "General",
    description: "List all the pools in the channel",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }
        return listPools(guildId);
    }
} as ICommand;