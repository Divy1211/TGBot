import {Guild} from "../../entities/Guild";
import {GuildMember} from "discord.js";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";

/**
 * Creates a queue with the given name and number of players, in the specified channel and server
 *
 * @param user
 * @param reason The reason to ban the user (optional)
 * @param guildId The ID of the server in which the queue should be created
 * @param channelId The ID of the channel in which the queue should be created
 */
export async function deleteBan(member: GuildMember, reason: string, guildId: string, channelId: string): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const discordId = member.id;
    let user = await User.findOneBy({discordId});
    if (!user) {
        const guild = await Guild.findOneBy({id: guildId});

        // a guild is created when a queue is created, so if the guild is not created
        // that means that there is no queue either, since guilds can't be deleted
        if (!guild) {
            return "There are no queues in this channel. Ask an admin to create one using /create_q!";
        }

        user = new User(discordId, {guilds: [guild]});
        await user.save();
    }
    const ban = await Ban.findOneBy({user:{discordId}});
    if (!ban){
        return `The user is not banned`;
    }
    await Ban.remove(ban);
    return `The user ${member.user.username} has been unbanned`;
}