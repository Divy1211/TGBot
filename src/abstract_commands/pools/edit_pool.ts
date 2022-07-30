import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";

/**
 * Change the name of a pool to a new name
 *
 * @param poolUuid The uuid of the pool
 * @param newName The new name of the pool
 * @param guildId The ID of the server in which the pool is created
 */
export async function editPool(poolUuid: number, newName: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let pool = await Pool.findOneBy({uuid: poolUuid, guild: {id: guildId}});
    
    if (!pool){
        // pool was not found
        return `Pool with ID ${poolUuid} was not found`;
    }

    if (pool.name == newName) {
        // new name is the same as the previous name
        return `Edition Unsuccessful: the new name is the same as the pool's current name.`
    }

    // change the pool name
    pool.name = newName;
    await pool.save();
    return `The name of the pool with ID "${poolUuid}" has been changed to "${newName}"!`;
}