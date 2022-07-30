import {Pool} from "../../entities/pools/Pool";

/**
 * Delete a given game map from the server
 *
 * @param poolUuid The uuid of the pool
 * @param guildId The ID of the server in which the Pool is created
 */
export async function deletePool(poolUuid: number, guildId: string) {
    // find the corresponding Pool
    let pool = await Pool.findOneBy({uuid: poolUuid, guild: {id: guildId}});
    if (!pool) {
        return `Pool with ID ${poolUuid} was not found`;
    }

    // remove the pool from the sever
    await pool.remove();

    return `Pool "${pool.name}" with ID ${poolUuid} has been deleted successfully!`;
}