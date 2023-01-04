import {MessageEmbed} from "discord.js";

import {Ban} from "../../entities/user_data/Ban";
import {ensure, partition} from "../../utils/general";

/**
 * Returns a list of bans on the server
 *
 * @param guildId The ID of the server to list the bans for
 */
export async function listBans(guildId: string): Promise<MessageEmbed[]> {
    const allBans = await Ban.find({
        where: {
            guild: {id: guildId},
        },
        relations: {
            user: true,
        },
    });

    const [expiredBans, pendingBans] = partition(allBans, (ban) => ban.until !== -1 && ban.until < Date.now()/1000);
    Ban.remove(expiredBans).then();

    if (pendingBans.length === 0) {
        return [
            new MessageEmbed()
                .setTitle("Bans")
                .setDescription("No bans")
                .setColor("#ED2939")
        ];
    }

    let embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for(let i = 0; i < pendingBans.length; i+=10) {
        const bans = pendingBans.slice(i, i + 10);
        if(i%10 === 0) {
            embed = new MessageEmbed()
                .setTitle("Bans")
                .setColor("#ED2939");
            embeds.push(embed);
        }
        embed.addFields([
            {
                name: "User",
                value: `${bans.map(ban => `<@${ensure(ban.user).discordId}>`).join("\n")}`,
                inline: true,
            },
            {
                name: "Reason",
                value: `${bans.map(ban => ban.reason || "-").join("\n")}`,
                inline: true,
            },
            {
                name: "Until",
                value: `${bans.map(ban => ban.until !== -1 ? `<t:${ban.until}:R>` : "permanent").join("\n")}`,
                inline: true,
            },
        ]);
    }
    return embeds
}