import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Deletes a given game map from the server
 *
 * @param gameMapUuid The uuid of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function deleteGameMap(gameMapUuid: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding GameMap
    let gameMap = await GameMap.findOneBy({uuid: gameMapUuid});
    if (!gameMap) {
        return `Map with ID ${gameMapUuid} was not found`;
    }

    // map is automatically removed from all pools by TypeORM

    // remove the map from the channel
    await gameMap.remove();

    return `Map ${gameMap.name} has been deleted.`;
}