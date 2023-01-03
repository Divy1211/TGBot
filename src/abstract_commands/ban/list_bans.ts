import {MessageEmbed} from "discord.js";

import {Ban} from "../../entities/user_data/Ban";
import {ensure} from "../../utils/general";

/**
 * Returns a list of bans on the server
 *
 * @param guildId The ID of the server to list the bans for
 */
export async function listBans(guildId: string): Promise<MessageEmbed> {
    const bans = await Ban.find({
        where: {
            guild: {id: guildId},
        },
        relations: {
            user: true,
        },
    });

    for(const ban of bans) {
        if (ban.until !== -1 && ban.until < Date.now() / 1000) {
            await ban.remove();
        }
    }

    if (bans.length === 0) {
        return new MessageEmbed()
            .setTitle("Bans")
            .setDescription("No bans")
            .setColor("#ED2939");
    }

    return new MessageEmbed()
        .setTitle("Bans")
        .setColor("#ED2939")
        .addFields([
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