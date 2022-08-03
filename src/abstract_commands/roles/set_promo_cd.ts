import {Guild} from "../../entities/Guild";
import {getDuration} from "../../utils/general";

/**
 * Sets the promotion cooldown for the provided guild to the provided duration
 *
 * @param guildId
 * @param cooldown
 */
export async function setPromoCooldown(guildId: string, cooldown: string): Promise<string> {
    const {error, hh, mm, ss} = getDuration(cooldown);
    if (error) {
        return error;
    }

    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    guild.promotionCooldown = hh * 3600 + mm * 60 + ss;
    await guild.save();

    return `Promotion cooldown set to: ${cooldown}.`;
}