import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Creates a map with the given name and image link in the specified server
 *
 * @param name The name of the map
 * @param imgLink The link of the preview image
 * @param guildId The ID of the server in which the map should be added
 */
export async function createMap(name: string, imgLink: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const map = new GameMap(name, imgLink, guild);
    await map.save();

    return `Map "${name}" has been created successfully!`;
}