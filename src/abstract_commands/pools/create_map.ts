import fetch from "node-fetch";
import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Create a map with the given name and image link in the specified server
 *
 * @param guildId The ID of the server in which the map should be added
 * @param name The name of the map
 * @param imgLink The link of the preview image
 */
export async function createMap(guildId: string, name: string, imgLink: string = ""): Promise<string> {
    if(imgLink) {
        try {
            await fetch(imgLink);
        } catch (e) {
            return "The URL provided for the image link is not valid";
        }
    }

    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const map = new GameMap(name, imgLink, guild);
    await map.save();

    return `Map "${name}" has been created successfully!`;
}