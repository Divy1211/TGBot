import fetch from "node-fetch";

import {User} from "../../entities/User";
import {AoE2Link} from "../../entities/user_data/AoE2Link";

/**
 * Link someone's discord account to their steam/aoe2.net profile
 *
 * @param discordId The ID of the user to link
 * @param steamId The steam ID of the user
 * @param profileId The aoe2.net profile ID of the user
 */
export async function linkAoE2(discordId: string, steamId?: string, profileId?: string) {
    let user = await User.findOneBy({discordId});
    if(!user) {
        user = new User(discordId);
        await user.save();
    }

    if(!steamId && !profileId) {
        return "At least one of steam or aoe2.net profile IDs must be specified";
    }

    const leaderboards = [0,1,2,3,4,13,14];

    if(steamId && !profileId) {
        for(const leaderboard of leaderboards) {
            const player: any = await (await fetch(
                `https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${leaderboard}&start=1&count=1&steam_id=${steamId}\n`,
            )).json();

            profileId = player.leaderboard[0]?.profile_id;
            if (profileId) {
                break;
            }
        }
    }

    if(profileId && !steamId) {
        for(const leaderboard of leaderboards) {
            const player: any = await (await fetch(
                `https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${leaderboard}&start=1&count=1&profile_id=${profileId}\n`
            )).json();

            steamId = player.leaderboard[0]?.steam_id;
            if (steamId) {
                break;
            }
        }
    }

    const aoe2link = new AoE2Link(user, {steamId, profileId});
    await aoe2link.save();

    return "Linked successfully";
}