import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Create a map with given name and imgLink, in the specified sever
 * 
 * @param name The name of the map
 * @param imgLink The link of the preview image
 * @param guildId The ID of the server in which the Map should be added
 */
export async function createMap(name: string, imgLink: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const map = new GameMap(name, imgLink, guild);
    await map.save();

    return `Map "${name} has been created successfully!"`
}