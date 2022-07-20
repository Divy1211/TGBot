import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";

/**
 * Creates a pool with the given name in the specified server
 *
 * @param name The name of the pool
 * @param guildId The ID of the server in which the pool is created
 */
export async function createPool(name: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const pool = new Pool(name, guild);
    await pool.save();

    return `Pool "${name}" has been created successfully!`;
}