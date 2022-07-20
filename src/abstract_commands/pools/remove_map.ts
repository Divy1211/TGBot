import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * Remove a map from the pool
 *
 * @param poolUuid The uuid of the pool
 * @param gameMapUuid The uuid of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function removeMap(gameMapUuid: number, poolUuid: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding map
    let gameMap = await GameMap.findOneBy({
        uuid: gameMapUuid,
        guild: {id: guildId}
    });

    if (!gameMap) {
        return `Map with ID ${gameMapUuid} was not found`;
    }

    let poolMap = await PoolMap.findOneBy({
        map: {uuid: gameMap.uuid, guild: {id: guildId}}, 
        pool: {uuid: poolUuid, guild: {id: guildId}}
    });

    if (!poolMap) {
        return `Map wit ID ${gameMapUuid} was not found in this pool`;
    }

    // remove the map from the pool
    await poolMap.remove();

    return `Map ${gameMap.name} removed from pool with ID ${poolUuid}.`;
}