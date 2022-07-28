import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {editMap} from "../../abstract_commands/pools/edit_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Edit the name a map in the sever",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "uuid",
            description: "The uuid of the map to edit",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "new_name",
            description: "The new name giving to the map",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        }
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;
        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }
        // get the command parameters
        const poolUuid = ensure(options.getInteger("uuid"));
        const newName = ensure(options.getString("new_name"));

        return await editMap(poolUuid, newName, guildId);
    },
} as ICommand;