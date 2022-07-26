import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * Adds a given map with the specified multiplier to the provided pool in the stated server
 *
 * @param mapUuid The uuid of the map
 * @param poolUuid The uuid of the pool
 * @param multiplier The number of players for this map
 * @param guildId The ID of the server in which the Map should be added
 */
export async function addMap(mapUuid: number, poolUuid: number, multiplier: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let pool = await Pool.findOneBy({
        uuid: poolUuid,
        guild: {id: guildId}
    });

    if (!pool) {
        return `Pool with ID \`${poolUuid}\` was not found.`;
    }

    let map = await GameMap.findOneBy({
        uuid: mapUuid,
        guild: {id: guildId}
    });

    if (!map) {
        return `Map with ID \`${mapUuid}\` was not found.`;
    }

    // else: check if map is already in the pool
    let poolMap = await PoolMap.findOneBy({map: {uuid: mapUuid}, pool: {uuid: poolUuid}});
    if (poolMap) {
        return `Error: Map "${poolMap.map.name}" is already in the pool with ID ${poolUuid}`;
    }

    // else: add the map into the pool
    const targetMap = new PoolMap(map, pool, multiplier);
    await targetMap.save();
    return `Map "${map.name}" added to Pool "${pool.name}"`;
}