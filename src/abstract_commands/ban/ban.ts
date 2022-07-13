import {Guild} from "../../entities/Guild";
import {GuildMember} from "discord.js";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";

/**
 * Creates a queue with the given name and number of players, in the specified channel and server
 *
 * @param user
 * @param duration The time span to ban the user (optional)
 * @param reason The reason to ban the user (optional)
 * @param guildId The ID of the server in which the queue should be created
 * @param channelId The ID of the channel in which the queue should be created
 */
export async function createBan(member: GuildMember, duration: string|null, reason: string, guildId: string, channelId: string): Promise<string> {
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
    if (!duration){
        const ban = new Ban(user,reason,-1);
        await ban.save();
    }
    else {
        let expireTime;
        let curTime = new Date().getTime();
        if (/^\d+:\d+:\d+$/.test(duration!)){
            try{
                const time = duration.split(":");
                const h = parseInt(time[0]);
                const m = parseInt(time[1]);
                const s = parseInt(time[2]);
                expireTime = h*60*60 + m*60 + s;
                const ban = new Ban(user, reason, expireTime*1000+curTime);
                await ban.save();
            }
            catch (e){
                return `The valid format of duration should be hh:mm[:ss]`
            }

        }
        else if (/^\d+:\d+$/.test(duration!)){
            try{
                const time = duration.split(":");
                const h = parseInt(time[0]);
                const m = parseInt(time[1]);
                expireTime = h*60*60 + m*60;
                const ban = new Ban(user, reason, expireTime*1000+curTime);
                await ban.save();
            }
            catch (e){
                return `The valid format of duration should be hh:mm[:ss]`
            }
        }
        else {
            return `The valid format of duration should be hh:mm[:ss]`
        }
    }

    return `The user ${member.user.username} has been banned`;
}