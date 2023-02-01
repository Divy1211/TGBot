import {Queue} from "../../entities/queues/Queue";
import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ensure} from "../../utils/general";

/**
 * list all the queues in a server
 *
 * @param channelId The ID of the channel in which this command was run
 * @param guildId The ID of the server to list the queues in
 * @param all If true, show all queues in the server else show queues only in current channel
 * @param showQIds If true, show the IDs of queues
 * @param showPoolIds If true, show IDs of pools used by a queue
 */
export async function listQ (channelId: string, guildId: string, all: boolean, showQIds: boolean,
    showPoolIds: boolean): Promise<string | MessageEmbed[]> {
    const allQueues = await Queue.find({
        where: all ? {guild: {id: guildId}} : {channelId},
        relations: {pools: showPoolIds},
    });

    if (allQueues.length === 0) {
        return "No queues found. Create one using /create_q!";
    }

    const embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for (let i = 0; i < allQueues.length; i += 10) {
        const queues = allQueues.slice(i, i + 10);
        if (i % 10 === 0) {
            embed = new MessageEmbed()
                .setTitle("Queues")
                .setDescription(all ? "All queues in the server" : "All queues in this channel")
                .setColor("#ED2939");
            embeds.push(embed);
        }

        // this is mostly string formatting stuff:
        const fields: EmbedFieldData[] = [
            {
                name: `${showQIds ? "ID         " : ""}Players   Name`,
                value: queues.map(({uuid, name, numPlayers, users}) => {
                    const uuidStr = `${uuid}`.padEnd(5);
                    const numPlayersStr = `${users.length}/${numPlayers}`.padEnd(7);
                    return (showQIds ? `\`${uuidStr}\` ` : "") + `\`${numPlayersStr}\` ${name}`;
                }).join("\n"),
                inline: true,
            },
        ];

        if (showPoolIds) { // } || showLeaderboardIds) {
            const columns = [];

            // if (showLeaderboardIds) {
            //     columns.push("Leaderboard ID");
            // }
            if (showPoolIds) {
                columns.push("Pools");
            }

            fields.push({
                name: columns.join("   "),
                value: queues.map(({leaderboard, pools}) => {
                    const strs = [];

                    // if (showLeaderboardIds) {
                    //     const uuidStr = `${ensure(leaderboard).uuid}`.padEnd(14);
                    //     strs.push(`\`${uuidStr}\``);
                    // }

                    if (showPoolIds) {
                        let poolStr = `${ensure(pools)?.map((pool) => pool.uuid)
                            .join(",")}` || "-";
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
