import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {Queue} from "../../entities/queues/Queue";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "List all the queues in the server",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "all",
            description: "If false, only the queues in the current channel are shown. Default: true",
            type: ApplicationCommandOptionTypes.BOOLEAN,
            required: false,
        },
        {
            name: "show_leaderboard_id",
            description: "If true, show the leaderboard IDs for the queue. Default: false",
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
        const all = options.getBoolean("all") ?? true;
        const showLeaderboard = options.getBoolean("show_leaderboard_id") ?? false;
        const showPools = options.getBoolean("show_pool_ids") ?? false;

        const queues = await Queue.find({
            where: all ? {guild: {id: guildId}} : {channelId},
            relations: {leaderboard: showLeaderboard, pools: showPools},
        });

        if (queues.length === 0) {
            return "No queues found. Create one using /create_q!";
        }

        let embed = new MessageEmbed()
            .setDescription(all ? "All queues in the server" : "All queues in this channel")
            .setColor("#ED2939")
            .setTitle("Queues");

        // this is mostly string formatting stuff:
        let fields: EmbedFieldData[] = [
            {
                name: "ID   Players   Name",
                value: queues.map(({uuid, name, numPlayers, users}) => {
                    return `\`${uuid} \` \`  ${users.length}/${numPlayers}  \` ${name}`;
                }).join("\n"),
                inline: true,
            },
        ];

        if (showPools || showLeaderboard) {
            let columns = [];

            if (showLeaderboard) {
                columns.push("Leaderboard ID");
            }
            if (showPools) {
                columns.push("Pools");
            }

            fields.push(
                {
                    name: columns.join("   "),
                    value: queues.map(({leaderboard, pools}) => {
                        let strs = [];

                        if (showLeaderboard)
                            strs.push(`\`       ${ensure(leaderboard).uuid}       \``);

                        if (showPools)
                            strs.push(`\`${ensure(pools)?.map((pool) => pool.uuid).join(", ")}\``);

                        return strs.join(" ");
                    }).join("\n"),
                    inline: true,
                },
            );
        }

        if (all) {
            fields.push({
                name: "Channel",
                value: queues.map(({channelId}) => `<#${channelId}>`).join("\n"),
                inline: true,
            });
        }

        embed.addFields(fields);
        return embed;
    },
} as ICommand;