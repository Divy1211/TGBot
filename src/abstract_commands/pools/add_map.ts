import {GameMap} from "../../entities/pools/GameMap";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * Add a given map with the specified multiplier to the provided pool in the stated server
 *
 * @param guildId The ID of the server in which the Map should be added
 * @param mapUuid The uuid of the map
 * @param poolUuid The uuid of the pool
 * @param multiplier The number of players for this map
 */
export async function addMap(
    guildId: string,
    mapUuid: number,
    poolUuid: number,
    multiplier: number = 1
): Promise<string> {
    let pool = await Pool.findOneBy({
        uuid: poolUuid,
        guild: {id: guildId},
    });
    if (!pool) {
        return `Pool with ID \`${poolUuid}\` does not exist in this server`;
    }

    let map = await GameMap.findOneBy({
        uuid: mapUuid,
        guild: {id: guildId},
    });
    if (!map) {
        return `Map with ID \`${mapUuid}\` does not exist in this server`;
    }

    let poolMap = await PoolMap.findOneBy({map: {uuid: mapUuid}, pool: {uuid: poolUuid}});
    if (poolMap) {
        return `Error: Map "${poolMap.map.name}" is already in the pool!`;
    }

    const targetedMap = new PoolMap(map, pool, multiplier);
    await targetedMap.save();
    return `Map "${map.name}" added to pool "${pool.name}" with multiplier \`${multiplier}\``;
}