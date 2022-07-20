import {Guild} from "../../entities/Guild";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";
import {ensure} from "../../utils/general";

/**
 * Bans a user from joining queues in a specific server
 *
 * @param discordId The ID of the user to ban
 * @param duration The duration to ban the user for
 * @param reason The reason for banning the user
 * @param guildId The ID of the server in which the user is banned
 */
export async function banUser(
    discordId: string,
    duration: string,
    reason: string,
    guildId: string,
): Promise<string> {
    let guild = await Guild.findOne({where: {id: guildId}, relations: {bans: true}});
    if (!guild) {
        guild = new Guild(guildId);
    }

    let user = await User.findOneBy({discordId});
    if (!user) {
        user = new User(discordId, {guilds: [ensure(guild)]});
        await user.save();
    }

    let ban = await Ban.findOneBy({user: {discordId}, guild: {id: guildId}});
    if (ban) {
        if (ban.until > 0 && ban.until < +Date.now() / 1000) {
            await ban.remove();
        } else if (ban.until > 0) {
            return `Error: <@${discordId}> is already banned${ban.reason ? ` for "${ban.reason}"` : ``} until <t:${ban.until}> which is <t:${ban.until}:R>`;
        } else {
            return `Error: <@${discordId}> is already banned permanently${ban.reason ? ` for "${ban.reason}"` : ``}`;
        }
    }

    if (!duration) {
        ban = new Ban(user, reason, -1, guild);
        await ban.save();
        return `<@${discordId}> has been banned permanently${reason ? ` for ${reason}` : ``}`;
    }

    // ss will be undefined if not specified
    // todo: do not push this change lol
    let [_, hh, mm, ss]: (string | number)[] = duration.match(/^(\d+):(\d{2})(?::(\d{2}))?$/) ?? ["-1", "-1", "-1", "-1"];
    if (hh === "-1") {
        return "Error: The format of the specified duration is invalid, please try again";
    }

    hh = parseInt(hh);
    mm = parseInt(mm);
    ss = ss ? parseInt(ss) : 0;

    if(mm > 59)
        return "Error: Minutes cannot be greater than 59";
    if(ss > 59)
        return "Error: Seconds cannot be greater than 59";

    ban = new Ban(user, reason, hh*3600+mm*60+ss + Math.floor(+Date.now()/1000), guild);
    await ban.save();

    return `<@${discordId}> has been banned${ban.reason ? ` for "${ban.reason}"` : ``} until <t:${ban.until}> which is <t:${ban.until}:R>`;
}