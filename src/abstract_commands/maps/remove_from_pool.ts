import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * Remove a map from the pool
 *
 * @param poolName The name of the pool
 * @param mapName The name of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function removeFromPool(poolName: string, mapName: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding map
    let game_map = await GameMap.findOneBy({name: mapName});
    if (!game_map) {
        return `Map ${mapName} is not found in this channel`;
    }

    let pool_map = await PoolMap.findOneBy({map: {uuid: game_map.uuid}, pool: {name: poolName}});
    if (!pool_map) {
        return `Map ${mapName} is not found in this pool`;
    }

    // remove the map from the pool
    await pool_map.remove();

    return ` Map ${mapName} has been remove from pool ${poolName} successfully!"`;
}