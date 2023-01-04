import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {listQ} from "../../abstract_commands/queues/list_q";
import {generatePaginatedEmbed} from "../../utils/djs";

export default {
    category: "General",
    description: "List all the queues in the server",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "all",
            description: "If false, only the queues in the current channel are shown. Default: true",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        },
        {
            name: "show_q_ids",
            description: "If true, show the queue IDs. Default: true",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        },
        {
            name: "show_pool_ids",
            description: "If true, show the pool IDs for the queue. Default: false",
            type: ApplicationCommandOptionTypes.BOOLEAN,
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
        const all = options.getBoolean("all") ?? false;
        const showQIds = options.getBoolean("show_leaderboard_id") ?? false;
        const showPoolIds = options.getBoolean("show_pool_ids") ?? false;

        const resp = await listQ(channelId, guildId, all, showQIds, showPoolIds);
        if(typeof resp === "string") {
            await interaction.reply({
                content: resp,
                ephemeral: true,
            })
            return;
        }
        await generatePaginatedEmbed(resp, interaction);
    },
} as ICommand;