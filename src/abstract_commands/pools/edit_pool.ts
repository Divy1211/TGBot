import {Pool} from "../../entities/pools/Pool";

/**
 * Change the name of a pool to a new name
 *
 * @param guildId The ID of the server in which the pool is created
 * @param poolUuid The uuid of the pool
 * @param newName The new name of the pool
 */
export async function editPool (guildId: string, poolUuid: number, newName?: string): Promise<string> {
    const pool = await Pool.findOneBy({uuid: poolUuid, guild: {id: guildId}});
    if (!pool) {
        return `Pool with ID ${poolUuid} does not exist in this server`;
    }

    if (newName) {
        pool.name = newName;
        await pool.save();
    }

    return `Pool "${pool.name}" has been edited successfully!`;
}
