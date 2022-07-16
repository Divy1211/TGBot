import {Guild} from "../../entities/Guild";
import { GameMap } from "../../entities/pools/GameMap";
import { PoolMap } from "../../entities/pools/PoolMap";

/**
 * Remove a map from a pool
 * 
 * @param pool_name The name of the pool
 * @param map_name The name of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function removeFromPool(pool_name: string, map_name: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let game_map = await GameMap.findOneBy({name: map_name});
    if (!game_map){
        return `Map ${map_name} is not found in this channel`
    }

    let pool_map = await PoolMap.findOneBy({map: {uuid: game_map.uuid}, pool: {name: pool_name}});
    if (!pool_map){
        return `Map ${map_name} is not found in this pool`
    }

    await pool_map.remove();

    return ` Map ${map_name} has been remove from pool ${pool_name} successfully!"`
}