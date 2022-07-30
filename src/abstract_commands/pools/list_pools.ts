import { MessageEmbed } from "discord.js";
import {Guild} from "../../entities/Guild";
import {Pool} from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";

/**
 * List all pools
 *
 * @param guildId The ID of the server in which the Pool is created
 */
 export async function listPools(guildId: string) {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let pools = await Pool.find({
        where: {guild: {id: guildId}}
    });

    if (pools.length===0) {
        // no pool was found
        return "No pool was found in this server."
    }

    // find all maps in the pool
    let allMapsText = [];
    for (let i = 0; i < pools.length; i++) {
        let maps = await PoolMap.find({
            where: {pool: {uuid: pools[i].uuid}},
        });
        
        let mapsText;
        if (maps.length===0) {
            mapsText = "no maps";
        }
        else {
            mapsText = maps.map(({map}) => `${map.uuid}`).join(", ");
        }
        allMapsText.push(mapsText);
    }

    // construct messageEmbed
    let messageEmbed = new MessageEmbed()
    .setTitle("Pools")
    .setColor("#0095F7")
    .setDescription("The list of pools in the server")
    .addFields(
        {
            name: "uuid",
            value: pools.map(({uuid}) => `${uuid}`).join("\n"),
            inline: true,
        },
        {
            name: "name",
            value: pools.map(({name}) => `${name}`).join("\n"),
            inline: true,
        },
        {
            name: "map_uuids",
            value: allMapsText.join("\n"),
            inline: true,
        }
    )
    return messageEmbed;
}