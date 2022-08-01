import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {createMap} from "../../abstract_commands/pools/create_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Create a map",
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
        {
            name: "img_link",
            description: "The link to an external image preview of the map",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
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
        const imgLink = options.getString("img_link") ?? "";

        return await createMap(name, imgLink, guildId);
    },
} as ICommand;