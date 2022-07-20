import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {showMap} from "../../abstract_commands/pools/show";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "Show statics of a map",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "name",
            description: "The name of the map",
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

        return await showMap(name, guildId);
    },
} as ICommand;