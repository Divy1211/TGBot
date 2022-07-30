import { ok } from "assert";
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
export async function listMaps(showPoolIds: boolean, guildId: string, poolUuid?: number) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let poolMaps: PoolMap[] = [];
    let gameMaps: GameMap[] = [];
    let description = "";

    if (poolUuid !== undefined){
        // pool_uuid wa given
        const pool = await Pool.findOneBy({uuid: poolUuid, guild: {id: guildId}});
        // pool was not found
        if (!pool) {
            return `The pool with ID ${poolUuid} was not found.`;
        }
        // pool was found
        poolMaps = pool.poolMaps;
        gameMaps = poolMaps.map((poolMap: PoolMap) => poolMap.map);
        description = `Maps in pool ${pool.name}`
    }
    else {
        //  pool_uuid was not given
        poolMaps = await PoolMap.find();
        gameMaps = await GameMap.find();
        description = "Maps in the sever"
    }

    // if no map was found
    if (gameMaps.length===0) {
        return "No map was found."
    }

    // find map's corresponding pools
    let mapPools:any = [];
    for (let gameMap of gameMaps){
        let poolMap = await PoolMap.find({
            where: {map: {uuid: gameMap.uuid}},
            relations: {pool: true}
        });
        
        let poolText;
        if (PoolMap.length===0){
            poolText = "No pools"
        }
        else {
            poolText = poolMap.map((x)=>`${x.pool?.uuid}`).join(", ");
        }
        mapPools.push(poolText);
    }

    return getMapEmbed(description, showPoolIds, gameMaps, poolMaps, mapPools);
}