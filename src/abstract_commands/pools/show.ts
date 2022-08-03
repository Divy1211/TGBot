import {EmbedFieldData, MessageEmbed} from "discord.js";

import {Guild} from "../../entities/Guild";
import {GameMap} from "../../entities/pools/GameMap";

/**
 * Show map statics
 *
 * @param gameMapUuid The uuid of the map
 * @param guildId The ID of the server in which the Pool is created
 */
export async function showMap(gameMapUuid: number, guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    // find the corresponding map
    var map = await GameMap.findOne({where: {uuid: gameMapUuid}});
    if (!map) {
        return `Map with ID ${gameMapUuid} was not found.`;
    }

    let embed = new MessageEmbed().setDescription(`Statics of Map with ID ${gameMapUuid}`).setColor("#0095F7")
        .setTitle(`Map Statics - ${map.name}`);
    let fields: EmbedFieldData[] = [];

    // todo: design embed

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