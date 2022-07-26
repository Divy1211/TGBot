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
export async function removeMap(gameMapUuid: number, guildId: string, poolUuid?: number) {
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
        return `Map with ID ${gameMapUuid} was not found.`;
    }

    if (poolUuid !== undefined){
        // poolUuid is specified
        let poolMap = await PoolMap.findOneBy({
            map: {uuid: gameMap.uuid, guild: {id: guildId}}, 
            pool: {uuid: poolUuid, guild: {id: guildId}}
        });
        if (!poolMap) {
            // poolMap not found
            return `Map with ID ${gameMapUuid} was not found in pool with ID ${poolUuid}.`;        }
        // poolMap was found
        // remove the map from the pool
        await poolMap.remove();
        return `Map ${gameMap.name} has been removed from the pool with ID ${poolUuid} successfully!`;
    }
    else {
        // poolUuid is not specified -> remove the map from all pools
        await PoolMap.remove(await PoolMap.find({
            where: {map: {uuid: gameMap.uuid, guild: {id: guildId}}}
        }));
        return `Map ${gameMap.name} removed from all pools.`;
    }
}