import {Guild} from "../../entities/Guild";
import {ensure, getDuration} from "../../utils/general";
import {User} from "../../entities/User";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import list_players from "../../commands/queues/list_players";

/**
 * Reset ratings for playerStats
 *
 * @param discordId The id of the user
 * @param leaderboard_uuid The uuid of a leaderboard
 * @param guildId The ID of the server in which this command is used
 */
export async function ratingReset(discordId:string, leaderboard_uuid:string): Promise<string> {
    if (discordId){
        let playerStat = await PlayerStats.findOneBy({user:{discordId}});
        if (!playerStat){
            return `The user <@${discordId}>'s rating has been reset`;
        }
        if (leaderboard_uuid){
            playerStat = await PlayerStats.findOne({
                where:{user:{discordId}, leaderboard:{uuid:parseInt(leaderboard_uuid)}},
                relations:{leaderboard:true},
            });
            if (playerStat){
                playerStat.rating = 1000;
                await playerStat.save();
            }
            return `The user <@${discordId}>'s rating has been reset`
        }
        playerStat.rating = 1000;
        await playerStat.save();
        return `The user <@${discordId}>'s rating has been reset`
    }

    if (leaderboard_uuid){
        let playerStats = await PlayerStats.find({
                where:{leaderboard:{uuid:parseInt(leaderboard_uuid)}},
                relations:{leaderboard:true},
            }
        )
        if (!playerStats){
            return `The leaderboard with id of ${leaderboard_uuid} does not exist`;
        }
        for (let playerStat of playerStats){
            playerStat.rating = 1000;
            await playerStat.save();
        }
        return `The players' ratings of leaderboard ${leaderboard_uuid} have been reset`;

    }

    let playerStats = await PlayerStats.find();
    for (let playerStat of playerStats){
        playerStat.rating = 1000;
        await playerStat.save();
    }

    return "All the players' ratings have been reset";
}