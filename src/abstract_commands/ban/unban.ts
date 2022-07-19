import {Guild} from "../../entities/Guild";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";

/**
 * Removes the ban on a user from joining queues in a specific server
 *
 * @param discordId The ID of the user to ban
 * @param guildId The ID of the server in which the user is banned
 */
export async function unbanUser(discordId: string, guildId: string): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        return `Error: <@${discordId}> is not banned`;
    }

    let user = await User.findOneBy({discordId});
    if (!user) {
        return `Error: <@${discordId}> is not banned`;
    }

    const ban = await Ban.findOneBy({user: {discordId}});

    if (!ban) {
        return `Error: <@${discordId}> is not banned`;
    }
    await ban.remove();
    return `<@${discordId}> has been unbanned`;
}