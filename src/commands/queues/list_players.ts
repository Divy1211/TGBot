import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {listPlayers} from "../../abstract_commands/queues/list_players";
import {User} from "../../entities/User";

export default {
    category: "User",
    description: "See all the players in a queue",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue to show the players from",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        // get the command parameters
        const uuid = options.getInteger("queue_uuid") ?? undefined;

        return await listPlayers(channelId, uuid);
    },
} as ICommand;
