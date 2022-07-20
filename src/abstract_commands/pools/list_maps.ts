import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";
import {getMapEmbed} from "../common";

/**
 * List all maps
 *
 * @param poolUuid The uuid of the pool
 * @param showPoolIds Showing pool_id if set to true
 * @param guildId The ID of the server in which the Pool is created
 */
export async function listMaps(poolUuid: number, showPoolIds: boolean, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let poolMaps: PoolMap[] = [];
    let gameMaps: GameMap[] = [];
    let description = "";

    if (poolUuid != 0){
        // given pool_uuid
        const pool = await Pool.findOneBy({uuid: poolUuid, guild: {id: guildId}});
        // pool was not found
        if (!pool) {
            return `The pool with ID ${poolUuid} was not found.`;
        }
        // pool was found
        poolMaps = pool.maps;
        gameMaps = poolMaps.map((poolMap: PoolMap) => poolMap.map);
        description = `Maps in pool ${pool.name}`
    }
    else {
        // not given a pool_uuid
        poolMaps = await PoolMap.find();
        gameMaps = await GameMap.find();
        description = "Maps in the sever"
    }

    // find map's corresponding pools
    let mapPools = [];
    for (let game_map of gameMaps){
        let poolMap = await PoolMap.find({
            where: {map: {uuid: game_map.uuid}},
            relations: {pool: true}
        });
        mapPools.push(poolMap.map((x)=>`${x.pool?.uuid}`).join(", "));
    }

    return getMapEmbed(description, showPoolIds, gameMaps, poolMaps, mapPools);
}