import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {createPool} from "../../abstract_commands/pools/create_pool";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Create a pool",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "name",
            description: "The name of the pool",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const name = ensure(options.getString("name"));

        return await createPool(name, guildId);
    },
} as ICommand;
