import {Guild} from "../../entities/Guild";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";

/**
 * unban a user in a specific server
 *
 * @param userId The ID of a discord user
 * @param guildId The ID of the server in which the user is unbanned
 */
export async function unbanUser(userId: string, guildId: string): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        return "Error: The user is not banned";
    }

    const discordId = userId;
    let user = await User.findOneBy({discordId});
    if (!user) {
        return "Error: The user is not banned";
    }
    const ban = await Ban.findOneBy({user: {discordId}});
    console.log(ban);
    if (!ban) {
        return `Error: The user is not banned`;
    }
    await ban.remove();
    return `The user <@${userId}> has been unbanned`;
}