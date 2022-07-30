import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Change the name of a map to a new name
 *
 * @param mapUuid The uuid of the map
 * @param newName The new name of the map
 * @param guildId The ID of the server in which the pool is created
 */
 export async function editMap(mapUuid: number, newName: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let gameMap = await GameMap.findOneBy({uuid: mapUuid, guild: {id: guildId}});
    
    if (!gameMap){
        // map was not found
        return `Map with ID ${mapUuid} was not found`;
    }
    
    if (gameMap.name == newName) {
        // new name is the same as the previous name
        return `Edition Unsuccessful: the new name is the same as the map's current name.`
    }

    // change the map name
    gameMap.name = newName;
    await gameMap.save();
    return `The name of the map with ID "${gameMap}" has been changed to "${newName}"!`;
}