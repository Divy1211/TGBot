import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {editQueue} from "../../abstract_commands/queues/edit";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Edit the information of a specific queue",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "name",
            description: "The name of the queue",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "num_players",
            description: "The max number of players for the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
            minValue: 2,
            maxValue: 8,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const uuid = ensure(options.getInteger("queue_uuid"));
        const name = options.getString("name") ?? "";
        const numPlayers = options.getInteger("num_players") ?? 0;

        return await editQueue(uuid, name, numPlayers, channelId);
    },
} as ICommand;