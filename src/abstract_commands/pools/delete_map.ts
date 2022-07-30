import {GameMap} from "../../entities/pools/GameMap";

/**
 * Delete a given game map from the server
 *
 * @param gameMapUuid The uuid of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function deleteGameMap(gameMapUuid: number, guildId: string) {
    // find the corresponding GameMap
    let gameMap = await GameMap.findOneBy({uuid: gameMapUuid, guild: {id: guildId}});
    if (!gameMap) {
        return `Map with ID ${gameMapUuid} was not found`;
    }

    // map is automatically removed from all pools by TypeORM
    // remove the map from the channel
    await gameMap.remove();

    return `Map "${gameMap.name}" with ID ${gameMapUuid} has been deleted successfully!`;
}