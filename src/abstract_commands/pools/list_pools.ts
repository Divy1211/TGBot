import {MessageEmbed} from "discord.js";

import {Pool} from "../../entities/pools/Pool";

/**
 * List all pools
 *
 * @param guildId The ID of the server in which the command is run
 * @param showPoolIds If true, shows the IDs of the pools
 */
export async function listPools(guildId: string, showPoolIds?: boolean): Promise<MessageEmbed> {
    let pools = await Pool.find({
        where: {
            guild: {id: guildId},
        },
    });
    if (pools.length === 0) {
        return new MessageEmbed()
            .setTitle("Server Pools")
            .setColor("#ED2939")
            .setDescription("No pools found");
    }

    let embed = new MessageEmbed()
        .setTitle("Server Pools")
        .setColor("#ED2939");

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
    return embed;
}