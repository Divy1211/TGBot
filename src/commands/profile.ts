import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import { Guild } from "../entities/Guild";

import {Queue} from "../entities/queues/Queue";
import { User } from "../entities/User";
import {ensure} from "../utils/general";
import {PlayerStats} from "../entities/queues/PlayerStats";
import {Leaderboard} from "../entities/queues/Leaderboard";

export default {
    category: "General",
    description: "List all the profile of a user",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "Specify a user to see its profile",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "leaderboard_uuid",
            description: "Show the profile from this leaderboard.",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: "queue_uuid",
            description: "Show the profile from the leaderboard of this queue.",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction,guild,channel}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const user_discord = options.getUser("user") ?? interaction.user;
        const leaderboard_uuid = options.getInteger("leaderboard_uuid") ?? -1;
        const queue_uuid = options.getInteger("queue_uuid") ?? -1;

        const discordId = user_discord.id;
        let user = await User.findOneBy({discordId:discordId});
        if (!user){
            let guild = await Guild.findOneBy({id: guildId});
            if (!guild) {
                guild = new Guild(guildId);
            }
            user = new User(discordId, {guilds: [guild]});
            await user.save();
        }

        let playerStats;
        // if queue_uuid is provided
        if (queue_uuid>0){
            const queue = await Queue.findOne({where:{uuid:queue_uuid}, relations:{leaderboard:true}});
            if (!queue){
                return `Queue with ID ${queue_uuid} does not exist in this channel`;
            }
            const leaderboard = ensure(queue.leaderboard);
            const uuid = leaderboard.uuid;
            playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid}, user:{discordId}},relations:{leaderboard:true, user:true}});

            if (!playerStats){
                playerStats = new PlayerStats(user,leaderboard);
                await playerStats.save();
            }
        }

        // if leaderboard_uuid is provided
        else if (leaderboard_uuid>0){
            const leaderboard = await Leaderboard.findOneBy({uuid:leaderboard_uuid});
            if (!leaderboard){
                return `Leaderboard with ID ${queue_uuid} does not exist in this channel`
            }
            playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid:leaderboard_uuid}, user:{discordId}},relations:{leaderboard:true, user:true}});
            if (!playerStats){
                playerStats = new PlayerStats(user,leaderboard);
                await playerStats.save();
            }
        }

        // if none of them is provided
        else {
            const queues = await Queue.find({relations:{leaderboard: true}});
            if (queues.length !== 1){
                return "Please specify a queue or a leaderboard"
            }
            const queue = queues[0];
            const leaderboard = ensure(queue.leaderboard);
            const uuid = leaderboard.uuid;
            playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid}, user:{discordId}}, relations:{leaderboard:true, user:true}});

            if (!playerStats){
                playerStats = new PlayerStats(user,leaderboard);
                await playerStats.save();
            }
        }

        return  await playerStats.getPlayerStatsEmbed(guild!, channel);

    },
} as ICommand;