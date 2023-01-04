import {MessageEmbed} from "discord.js";

import {Pool} from "../../entities/pools/Pool";

/**
 * List all pools
 *
 * @param guildId The ID of the server in which the command is run
 * @param showPoolIds If true, shows the IDs of the pools
 */
export async function listPools(guildId: string, showPoolIds?: boolean): Promise<MessageEmbed[]> {
    let allPools = await Pool.find({
        where: {
            guild: {id: guildId},
        },
    });
    if (allPools.length === 0) {
        return [
            new MessageEmbed()
                .setTitle("Server Pools")
                .setDescription("No pools found")
                .setColor("#ED2939")
        ];
    }

    let embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for(let i = 0; i < allPools.length; i+=10) {
        const pools = allPools.slice(i, i+10);
        if(i%10 === 0) {
            embed = new MessageEmbed()
                .setTitle("Server Pools")
                .setDescription("No pools found")
                .setDescription(`Showing ${i+1}-${Math.min(i+11, allPools.length)}/${allPools.length} Pools`)
                .setColor("#ED2939");
            embeds.push(embed);
        }
        if (showPoolIds) {
            embed.addFields([
                {
                    name: "ID",
                    value: pools.map((pool: Pool) => `\`${pool.uuid}\``).join("\n"),
                    inline: true,
                },
            ]);
        }

        embed.addFields([
            {
                name: "Name",
                value: pools.map((pool: Pool) => pool.name).join("\n"),
                inline: true,
            },
            {
                name: "Number of Maps",
                value: pools.map((pool: Pool) => `\`${pool.poolMaps.length}\``).join("\n"),
                inline: true,
            },
        ]);
    }
    return embeds;
}