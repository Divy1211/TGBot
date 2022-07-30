import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {editPool} from "../../abstract_commands/pools/edit_pool";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Edit the name of a pool in the sever",
    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "uuid",
            description: "The uuid of the pool to modify",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "name",
            description: "The new name of the pool",
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
        const newName = ensure(options.getString("name"));

        return await editPool(poolUuid, newName, guildId);
    },
} as ICommand;