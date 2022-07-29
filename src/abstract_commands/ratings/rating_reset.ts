import {PlayerStats} from "../../entities/queues/PlayerStats";
import {Queue} from "../../entities/queues/Queue";
import {ensure} from "../../utils/general";
import {User} from "../../entities/User";


/**
 * Reset ratings for playerStats
 *
 * @param discordId The id of the user
 * @param queue_uuid The uuid of a leaderboard
 */
export async function ratingReset(discordId:string, queue_uuid:string): Promise<string> {

    // if the user is specified, only reset for this user
    if (discordId){
        let playersStats = await PlayerStats.findBy({user:{discordId}});
        if (playersStats.length === 0){
            return `The user <@${discordId}>'s rating has been reset`;
        }

        // if queue is specified, find playerStat of the queue's leaderboard
        if (queue_uuid){
            const queue = await Queue.findOne({
                where:{uuid:parseInt(queue_uuid)},
                relations:{leaderboard:true}
            });
            if (!queue){
                return `Queue with ID ${queue_uuid} does not exist in this channel`
            }
            const leaderboard = ensure(queue.leaderboard);
            const leaderboard_uuid = leaderboard.uuid;

            let playerStat = await PlayerStats.findOne({
                where:{user:{discordId}, leaderboard:{uuid:leaderboard_uuid}},
                relations:{leaderboard:true},
            });
            if (playerStat){
                playerStat.rating = 1000;
                await playerStat.save();
            }
            return `The user <@${discordId}>'s rating has been reset`
        }

        // if no queue is specified, reset the user's rating in all leaderboards
        for (let playerStats of playersStats){
            playerStats.rating = 1000;
            await playerStats.save();
        }
        return `The user <@${discordId}>'s rating has been reset`
    }


    // if queue is specified, find the leaderboard and reset all user's rating of that leaderboard
    if (queue_uuid){
        const queue = await Queue.findOne({
            where:{uuid:parseInt(queue_uuid)},
            relations:{leaderboard:true}
        });
        if (!queue){
            return `Queue with ID ${queue_uuid} does not exist in this channel`
        }
        const leaderboard = ensure(queue.leaderboard);
        const leaderboard_uuid = leaderboard.uuid;
        let playersStats = await PlayerStats.find({
                where:{leaderboard:{uuid:leaderboard_uuid}},
                relations:{leaderboard:true},
            }
        )
        for (let playerStats of playersStats){
            playerStats.rating = 1000;
            await playerStats.save();
        }
        return `The players' ratings of leaderboard ${leaderboard_uuid} have been reset`;

    }

    // if neither queue and user is specified, reset all users in all leaderboard
    let playersStats = await PlayerStats.find();
    for (let playerStats of playersStats){
        playerStats.rating = 1000;
        await playerStats.save();
    }
    return "All the players' ratings have been reset";
}