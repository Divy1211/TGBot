import {Queue} from "../../entities/queues/Queue";
import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ensure} from "../../utils/general";


/**
 * list all the queues in a server
 *
 * @param channelId The ID of the channel in which this command was run
 * @param guildId The ID of the server to list the queues in
 * @param all If true, show all queues in the server else show queues only in current channel
 * @param showPools If true, show IDs of pools used by a queue
 * @param showLeaderboard If true,
 */
export async function listQ(
    channelId: string, guildId: string, all: boolean, showPools: boolean, showLeaderboard: boolean
): Promise<string | MessageEmbed[]> {
    const allQueues = await Queue.find({
        where: all ? {guild: {id: guildId}} : {channelId},
        relations: {leaderboard: showLeaderboard, pools: showPools},
    });

    if (allQueues.length === 0) {
        return "No queues found. Create one using /create_q!";
    }

    let embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for(let i = 0; i < allQueues.length; i+=10) {
        const queues = allQueues.slice(i, i + 10);
        if (i % 10 === 0) {
            embed = new MessageEmbed()
                .setDescription(all ? "All queues in the server" : "All queues in this channel")
                .setColor("#ED2939")
                .setTitle("Queues");
            embeds.push(embed);
        }

        // this is mostly string formatting stuff:
        let fields: EmbedFieldData[] = [
            {
                name: "ID         Players   Name",
                value: queues.map(({uuid, name, numPlayers, users}) => {
                    const uuidStr = `${uuid}`.padEnd(5);
                    const numPlayersStr = `${users.length}/${numPlayers}`.padEnd(7);
                    return `\`${uuidStr}\` \`${numPlayersStr}\` ${name}`;
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

            fields.push({
                name: columns.join("   "),
                value: queues.map(({leaderboard, pools}) => {
                    let strs = [];

                    if (showLeaderboard) {
                        const uuidStr = `${ensure(leaderboard).uuid}`.padEnd(14);
                        strs.push(`\`${uuidStr}\``);
                    }

                    if (showPools) {
                        let poolStr = `${ensure(pools)?.map((pool) => pool.uuid).join(",")}` || `-`;
                        poolStr = poolStr.padEnd(5);
                        strs.push(`\`${poolStr}\``);
                    }

                    return strs.join(" ");
                }).join("\n"),
                inline: true,
            });
        }

        if (all) {
            fields.push({
                name: "Channel",
                value: queues.map(({channelId}) => `<#${channelId}>`).join("\n"),
                inline: true,
            });
        }

        embed.addFields(fields);
    }
    return embeds;
}