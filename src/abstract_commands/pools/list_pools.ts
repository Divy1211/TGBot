import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";
import {getPoolEmbed} from "../common";

/**
 * List all pools
 *
 * @param guildId The ID of the server in which the Pool is created
 */
 export async function listPools(guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let pools = await Pool.find({
        where: {guild: {id: guildId}}
    });

    // find all maps in the pool
    let allMaps = [];
    for (let i = 0; i < pools.length; i++) {
        let map = await PoolMap.find({
            where: {pool: {uuid: pools[i].uuid}},
        });
        var maps = map.map(({map}) => `${map.name}`).join(", ");
        allMaps.push(maps);
    }
    return getPoolEmbed(pools, allMaps);
 }