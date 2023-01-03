import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import { Guild } from "../entities/Guild";

import {Queue} from "../entities/queues/Queue";
import { User } from "../entities/User";
import {ensure} from "../utils/general";
import {PlayerStats} from "../entities/queues/PlayerStats";
import {Leaderboard} from "../entities/queues/Leaderboard";
import { MessageEmbed } from "discord.js";
import { Match } from "../entities/matches/Match";
import { Player } from "../entities/matches/Player";

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
        const queue_uuid = options.getInteger("queue_uuid") ?? -1;
        let leaderboard;

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
            leaderboard = ensure(queue.leaderboard);
            const uuid = leaderboard.uuid;
            playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid}, user:{discordId}},relations:{leaderboard:true, user:true}});

            if (!playerStats){
                playerStats = new PlayerStats(user,leaderboard);
                await playerStats.save();
            }
        }

        // if leaderboard_uuid is provided
        // else if (leaderboard_uuid>0){
        //     const leaderboard = await Leaderboard.findOneBy({uuid:leaderboard_uuid});
        //     if (!leaderboard){
        //         return `Leaderboard with ID ${queue_uuid} does not exist in this channel`
        //     }
        //     playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid:leaderboard_uuid}, user:{discordId}},relations:{leaderboard:true, user:true}});
        //     if (!playerStats){
        //         playerStats = new PlayerStats(user,leaderboard);
        //         await playerStats.save();
        //     }
        // }

        // if none of them is provided
        else {
            const queues = await Queue.find({relations:{leaderboard: true}});
            if (queues.length !== 1){
                return "Please specify a queue"
            }
            const queue = queues[0];
            leaderboard = ensure(queue.leaderboard);
            const uuid = leaderboard.uuid;
            playerStats = await PlayerStats.findOne({where:{leaderboard:{uuid}, user:{discordId}}, relations:{leaderboard:true, user:true}});

            if (!playerStats){
                playerStats = new PlayerStats(user,leaderboard);
                await playerStats.save();
            }
        }

        const username = (await guild?.members.fetch(discordId)!).nickname!;
        const leaderboard_uuid = leaderboard.uuid;
        console.log(username)

        let playersStats = await PlayerStats.find({where:{leaderboard:{uuid:leaderboard_uuid}}})
        playersStats.sort((a,b) => { return a.rating - b.rating });
        
        let rank = 0;
        for (let p of playersStats){
            rank += 1;
            if (p.user.discordId === discordId){
                break;
            }
        }

        let winrate = 0;
        if (playerStats.numGames !== 0){
            winrate = playerStats.numWins/playerStats.numGames;
        }

        let Tier;
        let tier = Math.max(Math.floor((playerStats.rating-1000)/100),0)
        switch (tier){
            case 0:
                Tier = "I";
                break;
            case 1:
                Tier = "II";
                break;
            case 2:
                Tier = "III";
                break;
            case 3:
                Tier = "IV";
                break;
            case 4:
                Tier = "V";
                break;
            case 5:
                Tier = "VI";
                break;
            case 6:
                Tier = "VII";
                break;
            case 7:
                Tier = "VIII";
                break;
            case 8:
                Tier = "IX";
                break;
            case 9:
                Tier = "X";
                break;
            default:
                Tier = "X";
                break;
            }
        
        const profileImgUrl = user_discord.avatarURL() ?? user_discord.defaultAvatarURL
        
        // get historical statistics

        // get matches
        let matches = await Match.find({where:{players:{user:{discordId}}}})

        // sort by time
        matches.sort((a, b) => {return -a.endTime + b.endTime})

        // choose the latest 5
        let last_five_matches;
        if (matches.length < 5){
            last_five_matches = matches
        }
        else {
            last_five_matches = matches.slice(0,5)
        }
        
        const historical_rating = []
        const historical_rating_delta =[]
        const end_time = []
        // find players from the matches
        for (let match of matches){
            let match_uuid = match.uuid;
            let player = ensure(await Player.findOne({where:{match:{uuid:match_uuid},user:{discordId}},relations:{match:true}}))
            console.log(player.rating);
            historical_rating.push(player.rating);
            historical_rating_delta.push(player.ratingDelta);
            end_time.push(match.endTime);
        }

        let fields = [{
            name: "Rank",
            value: `\` ${rank} \`\u200B`,
            inline: true,
        },
        {
            name: "Rating",
            value: `\` ${playerStats.rating} \`\u200B`,
            inline: true,
        },
        {
            name: "Matches",
            value: `\`  ${playerStats.numGames}  \`\u200B`,
            inline: true,
        },
        {
            name: "Winrate",
            value: `\`  ${winrate}  \`\u200B`,
            inline: true,
        },
        {
            name: "Tier",
            value: `\` ${Tier} \`\u200B `,
            inline: true,
        },
        {
            name: "W/L/S",
            value: `\` ${playerStats.numWins}/${playerStats.numLosses}/${playerStats.streak} \`\u200B`,
            inline: true,
        },]

        if (historical_rating.length !== 0){
            fields.push( {
                name: "Rating change",
                value: historical_rating_delta.map(rating_change => `\`    ${rating_change}    \``).join("\n"),
                inline: true,
            },
            {
                name: "Time",
                value: end_time.map(time => ` <t:${time}> `).join("\n"),
                inline: true,
            },)
        }


        
        let messageEmbed = new MessageEmbed()
            .setColor('#00ffff')
            .setTitle(`__${username}__`)
            .setColor("#ED2939")
            .setThumbnail(profileImgUrl)
        
        messageEmbed.addFields(fields);

        return messageEmbed;
        // return  await playerStats.getPlayerStatsEmbed(guild!, channel);

    },
} as ICommand;