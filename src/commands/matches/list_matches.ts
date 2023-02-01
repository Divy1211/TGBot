import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {listMatches} from "../../abstract_commands/matches/list_matches";
import {generatePaginatedEmbed} from "../../utils/djs";

export default {
    category: "General",
    description: "List all the matches in the server",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "show_match_ids",
            description: "If true, show the IDs of the matches. Default: true",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        },
        {
            name: "user",
            description: "When selected, only show matches of this user.",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "queue_id",
            description: "Only show matches of the leaderboard of this particular queue",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        const showMatchIds = options.getBoolean("show_match_ids") ?? true;
        const discordId = options.getUser("user")?.id;
        const queueId = options.getInteger("queue_id") ?? undefined;

        const resp = await listMatches(guildId, discordId, queueId, showMatchIds);

        if (typeof resp === "string") {
            await interaction.reply({
                content: resp,
                ephemeral: true,
            });
            return;
        }
        await generatePaginatedEmbed(resp, interaction);
    },
} as ICommand;
