import { relative } from "path";
import {Guild} from "../../entities/Guild";
import {User} from "../../entities/User";
import {Ban} from "../../entities/user_data/Ban";
import { ensure } from "../../utils/general";

/**
 * ban a user in a specific server
 *
 * @param userId The ID of a discord user
 * @param duration The duration to ban the user for
 * @param reason The reason for banning the user
 * @param guildId The ID of the server in which the user is banned
 */
export async function banUser(userId: string, duration: string|null, reason: string, guildId: string): Promise<string> {
    let guild = await Guild.findOne({where: {id: guildId},relations:{bans:true}});
    if (!guild) {
        guild = new Guild(guildId);
    }

    const discordId = userId;
    let user = await User.findOneBy({discordId});

    if (!user) {
        user = new User(discordId, {guilds: [ensure(guild)]});
        await user.save();
    }

    let ban = await Ban.findOneBy({user:{discordId}});
    console.log(ban);
    if (ban){
        if (ban.until > 0 && ban.until < new Date().getTime()/1000){
            await ban.remove();
        }
        else if (ban.until > 0){
            return `Error: <@${userId}> has already been banned for <t:${ban.until}:R>`;
        }
        else{
            return `Error: <@${userId}> has already been banned permanently`;
        }
    }
    if (!duration){
        ban = new Ban(user,reason,-1,guild);
        await ban.save();
        if (!ban.reason){
            return `<@${userId}> has been banned permanently`;
        }   
        return `<@${userId}> has been banned for "${ban.reason}" permanently`;
    }

    let expireTime;
    let curTime = new Date().getTime();
    
    const [_, hh, mm, ss] = duration.match(/^(\d+):(\d{2})(:\d{2})?$/) ?? ["-1", "-1", "-1", "-1"];
    // ss will be undefined if not specified

    if(hh == "-1") {
        return "Error: The format of the specified duration is invalid, please try again;"
    }
    if (!ss){
        try {
            const h = parseInt(hh);
            const m = parseInt(mm);
            expireTime = h*60*60 + m*60
            ban = new Ban(user,reason,Math.floor((expireTime*1000+curTime)/1000),guild);
            await ban.save();
        }
        catch (e){
            return "Error: The format of the specified duration is invalid, please try again;"
        }
    }
    else{
        try{
            const h = parseInt(hh);
            const m = parseInt(mm);
            const s = parseInt(ss.slice(1));
            expireTime = h*60*60 + m*60 + s;
            ban = new Ban(user,reason,Math.floor((expireTime*1000+curTime)/1000),guild);
            await ban.save();

        }
        catch (e){
            console.log(e)
            return "Error: The format of the specified duration is invalid, please try again;"
        }
    }


    if (!ban.reason){
        return `<@${userId}> has been banned for <t:${ban.until}:R>`;
    }   
    return `<@${userId}> has been banned for "${ban.reason}" for <t:${ban.until}:R>`;
}