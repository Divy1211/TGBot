import {Guild} from "../../entities/Guild";
import { GameMap } from "../../entities/pools/GameMap";
import { PoolMap } from "../../entities/pools/PoolMap";

/**
 * Remove a map from a pool
 * 
 * @param mapName The name of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function removeFromAll(mapName: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let game_map = await GameMap.findOneBy({name: mapName});
    if (!game_map){
        return `Map ${mapName} is not found in this channel`
    }

    let pool_map = await PoolMap.findBy({map: {uuid: game_map.uuid}});
    for (let i=0; i<pool_map.length; i++){
        await pool_map[i].remove();
    }

    await game_map.remove();

    return ` Map ${mapName} has been remove from this channel!"`
}