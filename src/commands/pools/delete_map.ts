import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {deleteGameMap} from "../../abstract_commands/pools/delete_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Remove a map from the channel",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "uuid",
            description: "the uuid of the map",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        const map_uuid = ensure(options.getInteger("uuid"));

        return await deleteGameMap(map_uuid, guildId);
    },
} as ICommand;