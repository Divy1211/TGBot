import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * Create a map with given name and imgLink, in the specified sever
 *
 * @param map_name The name of the map
 * @param pool_name The name of the pool
 * @param multiplier The number of players for this map
 * @param guildId The ID of the server in which the Map should be added
 */
export async function addMap(map_name: string, pool_name: string, multiplier: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let pool = await Pool.findOneBy({
        name: pool_name,
    });

    let map = await GameMap.findOneBy({
        name: map_name,
    });

    if (!pool) {
        return `Pool ${pool_name} is not found in this channel.`;
    } else if (!map) {
        return `Map ${map_name} is not found in this channel.`;
    }

    // else: check if map is already in the pool
    let pool_map = await PoolMap.find({
        where: {pool: {uuid: pool.uuid}},
    });

    for (let i = 0; i < pool_map.length; i++) {
        if (pool_map[i].map.name == map_name) {
            return `Invalid Operation: Map ${map_name} has already been in pool ${pool_name}!`;
        }
    }

    // else: add the map into the pool
    const target_map = new PoolMap(map, pool, multiplier);
    await target_map.save();
    return `Map ${map_name} is successfully added into Pool ${pool_name}!`;
}