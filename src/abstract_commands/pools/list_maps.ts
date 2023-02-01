import {MessageEmbed} from "discord.js";

import {GameMap} from "../../entities/pools/GameMap";
import {Pool} from "../../entities/pools/Pool";

/**
 * List all maps
 *
 * @param guildId The ID of the server in which the command is run
 * @param showPoolIds If true, show the IDs of the pools where the map is used
 * @param showMapIds If true, show the maps' IDs
 * @param poolUuid The uuid of the pool to show the maps for
 */
export async function listMaps (guildId: string,
    showPoolIds: boolean,
    showMapIds: boolean,
    poolUuid?: number): Promise<string | MessageEmbed[]> {
    const pool = await Pool.findOne({
        where: {
            uuid: poolUuid,
        },
        relations: {
            poolMaps: {
                map: true,
            },
        },
    });

    if (poolUuid) {
        if (!pool) {
            return `Pool with ID \`${poolUuid}\` does not exist in this server`;
        }
        return pool.getMapEmbeds(showMapIds);
    }

    const gameMaps = await GameMap.find({
        where: {
            guild: {id: guildId},
        },
        relations: {
            poolMaps: {pool: showPoolIds},
        },
    });

    if (gameMaps.length === 0) {
        return [
            new MessageEmbed()
                .setTitle("Server Maps")
                .setDescription("No maps found")
                .setColor("#ED2939"),
        ];
    }
    const embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for (let i = 0; i < gameMaps.length; i += 10) {
        const maps = gameMaps.slice(i, i + 10);
        if (i % 10 === 0) {
            embed = new MessageEmbed()
                .setTitle("Server Maps")
                .setDescription(`Showing ${i + 1}-${Math.min(i + 11, gameMaps.length)}/${gameMaps.length} Maps`)
                .setColor("#ED2939");
            embeds.push(embed);
        }
        if (showMapIds) {
            embed.addFields([
                {
                    name: "ID",
                    value: maps.map((gameMap: GameMap) => `${gameMap.uuid}`).join("\n"),
                    inline: true,
                },
            ]);
        }

        embed.addFields([
            {
                name: "Name",
                value: maps.map((gameMap: GameMap) => `${gameMap.hyperlinkedName}`).join("\n"),
                inline: true,
            },
        ]);

        if (showPoolIds) {
            embed.addFields([
                {
                    name: "Pool IDs",
                    value: maps.map((gameMap: GameMap) => gameMap.poolIds).join("\n"),
                    inline: true,
                },
            ]);
        }
    }
    return embeds;
}
