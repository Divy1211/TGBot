import {MessageEmbed} from "discord.js";

import {GameMap} from "../../entities/pools/GameMap";

/**
 * Show map statics
 *
 * @param gameMapUuid The uuid of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function showMap(gameMapUuid: number, guildId: string): Promise<string | MessageEmbed> {
    const gameMap = await GameMap.findOneBy({uuid: gameMapUuid});
    if (!gameMap) {
        return `Map with ID \`${gameMapUuid}\` does not exist in this server`;
    }

    return gameMap.embed;
}