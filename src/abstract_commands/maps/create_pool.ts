import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";

/**
 * Create a pool with given name, in the specified sever
 * 
 * @param name The name of the pool
 * @param guildId The ID of the server in which the Pool is created
 */
export async function createPool(name: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const pool = new Pool(name, guild);
    await pool.save();

    return `Pool "${name} has been created successfully!"`
}