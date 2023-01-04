import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {showMap} from "../../abstract_commands/pools/show_map";
import {ensure} from "../../utils/general";
import edit_map from "./edit_map";

export default {
    category: "General",
    description: "Show stats of a map",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "map_uuid",
            description: "The uuid of the map to show",
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
        const mapUuid = ensure(options.getInteger("map_uuid"));

        const resp = await showMap(mapUuid, guildId);
        await interaction.reply({
            content: typeof resp === "string" ? resp : undefined,
            embeds: typeof resp === "string" ? [] : [resp],
            ephemeral: true,
        });
    },
} as ICommand;