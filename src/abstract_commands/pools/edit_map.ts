import fetch from "node-fetch";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Change the name of a map to a new name
 *
 * @param guildId The ID of the server in which the pool is created
 * @param mapUuid The uuid of the map
 * @param newName The new name of the map
 * @param newImgLink The new image link for the map
 */
export async function editMap (guildId: string,
    mapUuid: number,
    {
        newName,
        newImgLink,
    }: {newName?: string, newImgLink?: string}): Promise<string> {
    const gameMap = await GameMap.findOneBy({uuid: mapUuid, guild: {id: guildId}});
    if (!gameMap) {
        return `Map with ID ${mapUuid} does not exist in this server`;
    }

    if (newName) {
        gameMap.name = newName;
    }
    if (newImgLink) {
        if (newImgLink === "null") {
            gameMap.imgLink = "";
        } else {
            try {
                await fetch(newImgLink);
            } catch (e) {
                return "The URL provided for the image link is not valid";
            }
            gameMap.imgLink = newImgLink;
        }
    }

    if (newName || newImgLink) {
        await gameMap.save();
    }

    return `Map "${gameMap.name}" has been edited successfully!`;
}
