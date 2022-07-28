import {Guild} from "../../entities/Guild";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";
import {ensure} from "../../utils/general";
import {getDuration} from "../common";

/**
 * Bans a user from joining queues in a specific server
 *
 * @param discordId The ID of the user to ban
 * @param guildId The ID of the server in which the user is banned
 * @param duration The duration to ban the user for
 * @param reason The reason for banning the user
 */
export async function banUser(
    discordId: string,
    guildId: string,
    duration: string,
    reason: string,
): Promise<string> {
    let guild = await Guild.findOne({where: {id: guildId}, relations: {bans: true}});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let user = await User.findOneBy({discordId});
    if (!user) {
        user = new User(discordId, {guilds: [ensure(guild)]});
    }

    let ban = await Ban.findOneBy({user: {discordId}, guild: {id: guildId}});
    if (ban) {
        if (ban.until > 0 && ban.until < Date.now() / 1000) {
            await ban.remove();
        } else if (ban.until > 0) {
            return `Error: <@${discordId}> is already banned ${ban.str}`;
        } else {
            return `Error: <@${discordId}> is already banned ${ban.str}`;
        }
    }

    if (!duration) {
        ban = new Ban(user, reason, -1, guild);
        await ban.save();
        return `<@${discordId}> has been banned ${ban.str}`;
    }

    // ss will be undefined if not specified
    const {error, hh, mm, ss} = getDuration(duration);
    if (error) {
        return error;
    }

    ban = new Ban(user, reason, hh * 3600 + mm * 60 + ss + Math.floor(Date.now() / 1000), guild);
    await ban.save();

    return `<@${discordId}> has been banned ${ban.str}`;
}