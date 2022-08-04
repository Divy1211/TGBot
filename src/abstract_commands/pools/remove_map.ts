import {GameMap} from "../../entities/pools/GameMap";
import {PoolMap} from "../../entities/pools/PoolMap";
import {ensure} from "../../utils/general";

/**
 * Remove a map from the pool
 *
 * @param guildId The ID of the server in which the command is run
 * @param gameMapUuid The uuid of the map
 * @param poolUuid? The uuid of the pool
 */
export async function removeMap(guildId: string, gameMapUuid: number, poolUuid?: number): Promise<string> {
    let gameMap = await GameMap.findOne({
        where: {
            uuid: gameMapUuid,
            guild: {id: guildId},
        },
        relations: {
            poolMaps: {
                pool: true,
            },
        },
    });

    if (!gameMap) {
        return `Map with ID ${gameMapUuid} does not exist in this server`;
    }

    if (!poolUuid) {
        gameMap.poolMaps = [];
        await gameMap.save();

        return `Map "${gameMap.name}" removed from all pools`;
    }

    gameMap.poolMaps = ensure(gameMap.poolMaps).filter((poolMap: PoolMap) => ensure(poolMap.pool).uuid !== poolUuid);
    await gameMap.save();

    return `Map "${gameMap.name}" has been successfully removed from the pool with ID ${poolUuid}`;
}