import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {deletePool} from "../../abstract_commands/maps/delete_pool";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Delete a pool from the sever",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "uuid",
            description: "the uuid of the pool",
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
        const pool_uuid = ensure(options.getInteger("uuid"));

        return await deletePool(pool_uuid, guildId);
    },
} as ICommand;