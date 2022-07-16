import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import { removeFromAll } from "../../abstract_commands/maps/remove_from_all";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Remove a map from the channel",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "map_name",
            description: "the name of the map",
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
        const map_name = ensure(options.getString("map_name"));
        

        return await removeFromAll(map_name, guildId);
    },
} as ICommand;
