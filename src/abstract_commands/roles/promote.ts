import {Guild} from "../../entities/Guild";

/**
 * Pings the promotion role on the provided server
 *
 * @param guildId The guildId of the server
 */
export async function promote (guildId: string): Promise<string> {
    const guild = await Guild.findOneBy({id: guildId});

    if (!guild?.promotionRoleId) {
        return "No promotion role set.";
    }

    const now = Math.floor(Date.now() / 1000);

    if (now - guild.lastPromotion < guild.promotionCooldown) {
        return "Too little time between promotions. " +
               `The next promotion can be used <t:${guild.lastPromotion + guild.promotionCooldown}:R>.`;
    }

    guild.lastPromotion = now;
    await guild.save();
    return `Come play some games! <@&${guild?.promotionRoleId}>`;
}
