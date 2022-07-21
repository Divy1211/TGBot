import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";

/**
 * Deletes a given game map from the server
 *
 * @param poolUuid The uuid of the pool
 * @param guildId The ID of the server in which the Pool is created
 */
export async function deletePool(poolUuid: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding Pool
    let pool = await Pool.findOneBy({uuid: poolUuid});
    if (!pool) {
        return `Map with ID ${poolUuid} was not found`;
    }

    // remove the pool from the sever
    await pool.remove();

    return `Pool ${pool.name} has been deleted.`;
}