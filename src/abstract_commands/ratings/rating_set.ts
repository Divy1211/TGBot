import {PlayerStats} from "../../entities/queues/PlayerStats";
import {Queue} from "../../entities/queues/Queue";
import {User} from "../../entities/User";
import {ensure} from "../../utils/general";


/**
 * Reset ratings for playerStats
 *
 * @param discordId The id of the user
 * @param queue_uuid The uuid of a leaderboard
 * @param rating The new rating of the user
 */
export async function ratingSet(discordId:string, queue_uuid:string, rating:number): Promise<string> {

    let user = await User.findOneBy({discordId});
    if (!user){
        user = new User(discordId);
        await user.save();
    }

    // check how many queues exist, if more than one, check whether a queue_uuid is provided
    const queues = await Queue.find();
    if (queues.length !== 1 && !queue_uuid){
        return "Please choose a queue you want to set rating for"
    }

    let playersStats = await PlayerStats.findBy({user:{discordId}});
    // if the playerStats does not exist, create one in the leaderboard from the specified queue
    if (playersStats.length === 0){
        let queue;
        // if queue_uuid is not provided, there should be only one queue
        if (!queue_uuid){
            const queues = await Queue.find({relations:{leaderboard:true}});
            queue = queues[0];
        }

        // if a queue uuid is provided, check whether it is a valid uuid
        else {
            queue = await Queue.findOne({
                where:{uuid:parseInt(queue_uuid)},
                relations:{leaderboard:true}
                });
            if (!queue){
                return `Queue with ID ${queue_uuid} does not exist in this channel`;
            }
        }
        const leaderboard = ensure(queue.leaderboard);
        const user = ensure(await User.findOneBy({discordId}));
        let playerStats = new PlayerStats(user,leaderboard,{rating:rating});
        await playerStats.save();
        return `The user <@${discordId}>'s rating has been set to ${rating}`;
    }

    // if a queue is specified
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
        let playerStats = await PlayerStats.findOne({
            where:{user:{discordId}, leaderboard:{uuid:leaderboard_uuid}},
            relations:{leaderboard:true},
        });
        if (playerStats){
            playerStats.rating = rating;
            await playerStats.save();
        }
        else {
            const leaderboard = ensure(queue.leaderboard);
            playerStats = new PlayerStats(user,leaderboard,{rating:rating});
            await playerStats.save();
        }
        return `The user <@${discordId}>'s rating has been set to ${rating}`
    }

    // if there is only one queue and
    for (let playerStats of playersStats){
        playerStats.rating = rating;
        await playerStats.save();
    }
    return `The user <@${discordId}>'s rating has been set to ${rating}`

}