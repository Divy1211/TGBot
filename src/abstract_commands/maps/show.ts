import {EmbedFieldData, MessageEmbed} from "discord.js";

import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Show map statics
 *
 * @param mapName The name of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function showMap(mapName: string, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding map
    var map = await GameMap.findOne({where: {name: mapName}});
    if (!map) {
        return `Map ${mapName} not found in the channel`;
    }

    let embed = new MessageEmbed().setDescription(`Statics of Map: ${mapName}`).setColor("#0095F7")
        .setTitle(`Map Statics - ${mapName}`);
    let fields: EmbedFieldData[] = [];

    fields.push({
        name: "name",
        value: map.name,
        inline: false,
    });
    fields.push({
        name: "uuid",
        value: `${map.uuid}`,
        inline: false,
    });
    fields.push({
        name: "numTotal",
        value: `${map.numTotal}`,
        inline: false,
    });
    fields.push({
        name: "numClicked",
        value: `${map.numClicked}`,
        inline: false,
    });
    fields.push({
        name: "numChosen",
        value: `${map.numChosen}`,
        inline: false,
    });

    embed.addFields(fields);
    return embed;
}