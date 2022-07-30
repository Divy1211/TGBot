import {MessageEmbed} from "discord.js";
import { GameMap } from "../entities/pools/GameMap";
import { Pool } from "../entities/pools/Pool";
import { PoolMap } from "../entities/pools/PoolMap";
import {Queue} from "../entities/queues/Queue";


/**
 * Get an embed to show the players in the given queue
 *
 * @param queue the queue to show the players for
 */
export function getPlayerEmbed(queue: Queue): MessageEmbed {
    return new MessageEmbed()
        .setTitle(queue.name)
        .setColor("#ED2939")
        .addFields(
            {
                name: `Players ${queue.users.length}/${queue.numPlayers}`,
                value: queue.users.map((user, i) => {
                    return `${i + 1}. <@${user.discordId}>`;
                }).join("\n") || "No players in queue",
            },
        );
}


/**
 * Get an embed to show the maps in a given sever & pool
 *
 * @param description the description of the embed
 * @param showPoolIds showing pool_id if set to true
 * @param gameMaps showing game maps
 * @param poolMaps corresponding pool maps
 * @param mapPools corresponding pools of maps
 */
export function getMapEmbed(description: string, showPoolIds: boolean, gameMaps: GameMap[], poolMaps: PoolMap[], mapPools: string[]): MessageEmbed {
    // todo: paginate embed
    let messageEmbed = new MessageEmbed()
    .setTitle("Maps")
    .setColor("#0095F7")
    .setDescription(description)
    .addFields(
        {
            name: "uuid  name",
            value: gameMaps.map(({uuid, name}) => ` \` ${uuid} \`     \`${name}\` `).join("\n"),
            inline: true,
        },
        {
            name: "multiplier",
            value: poolMaps.map(({multiplier}) => `${multiplier}`).join("\n"),
            inline: true,
        }
    );

    if (showPoolIds) {
        messageEmbed.addField("pool_uuids", mapPools.join("\n"), true);
    }

    return messageEmbed;
}


/**
 * Get an embed to show the pools in a given sever
 *
 * @param pools pools in the sever
 * @param allMaps maps for each pool
 */
export function getPoolEmbed(pools: Pool[], allMaps: String[]){
    // todo: paginate embed
    return new MessageEmbed()
    .setTitle("Pools")
    .setColor("#0095F7")
    .setDescription("The list of pools in the channel")
    .addFields(
        {
            name: "uuid",
            value: pools.map(({uuid}) => `${uuid}`).join("\n"),
            inline: true,
        },
        {
            name: "name",
            value: pools.map(({name}) => `${name}`).join("\n"),
            inline: true,
        },
        {
            name: "map_uuids",
            value: allMaps.join("\n"),
            inline: true,
        }
    )
}