import {GuildMember} from "discord.js";
import {rate, Rating} from "ts-trueskill";

import {Player} from "../../entities/matches/Player";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import {ensure, zip} from "../../utils/general";
import {isMod} from "../permissions";

/**
 * Reports the loss for a match and team or for a captain (discordId)
 *
 * @param discordId The ID of the reporting user
 * @param channelId The ID of channel where the command is run
 * @param member The server member object to use for permissions
 * @param matchUuid The ID of the match to report the loss for
 * @param team The losing team
 * @param loss if false, reporting a win.
 */
export async function report(
    discordId: string | undefined,
    channelId: string,
    member: GuildMember,
    matchUuid?: number,
    team?: number,
    loss: boolean = true,
) {
    if (matchUuid && team) {
        discordId = undefined;
    }
    // if the reporting user is a captain/player, then discordId and endTime should narrow this down to just one
    // player object. if the reporting user is not a player, then this will result in an undefined object which will
    // make the function return, UNLESS both a matchUuid and team is specified, in that case the discordId is set to
    // undefined, so a single player matching the matchUuid and team can be found and then the logic with the player
    // object is the same in all the cases

    const player = await Player.findOne({
        where: {
            user: {discordId},
            match: {
                uuid: matchUuid,
                queue: {channelId},
                endTime: -1,
            },
            team,
        },
        relations: {
            match: {
                players: {
                    user: true,
                },
                guild: true,
            },
        },
    });

    if (!player) {
        return "Error: Match not found. Please specify match ID and team of an **ongoing** game if you are a moderator";
    }

    const match = ensure(player.match);
    if(!match.map) {
        return "Error: Cannot report match before it has begun";
    }
    const guild = ensure(match.guild);
    const isModerator = isMod(member, guild);
    await guild.save();

    if (loss && !player.isCaptain && !isModerator) {
        return "Error: Only captains or moderators can report losses";
    } else if (!loss && !isModerator) {
        return "Error: Only moderators can report wins";
    }

    match.winningTeam = loss ? 3 - player.team : player.team; // to get opposite team: 3-2 => 1, 3-1 => 2
    match.endTime = Math.floor(Date.now() / 1000);

    if (match.lobbyId === -1) {
        // todo: fetch
        // todo: player civs
        // todo: player colours
    }

    await match.save();

    let teamStats: PlayerStats[][] = [[], []];
    for (const player of ensure(match.players)) {
        const user = ensure(player.user);
        user.inGame = false;
        user.currentMatch = null;
        await user.save();

        const stats = ensure(await PlayerStats.findOneBy({
            user: {discordId: user.discordId},
            leaderboard: {
                matches: {uuid: match.uuid},
            },
        }));

        teamStats[player.team - 1].push(stats);
        if (player.team === match.winningTeam) {
            stats.streak = Math.max(0, stats.streak) + 1;
        } else {
            stats.streak = Math.min(0, stats.streak) - 1;
        }
        stats.lastMatch = match;
    }
    if (match.winningTeam === 2) {
        teamStats = [teamStats[1], teamStats[0]];
    }

    let teamRatings = teamStats.map((team: PlayerStats[]) => team.map(
        (stats: PlayerStats) => new Rating(stats.rating, stats.sigma + 5 * Math.abs(stats.streak))
    ));
    teamRatings = rate(teamRatings);
    const idx = match.winningTeam === 2 ? 1 : 0;
    const newPlayerRatings = [...teamRatings[idx], ...teamRatings[1-idx]];
    const playerStats = [...teamStats[idx], ...teamStats[1-idx]];

    for (const [player, newRating, stats] of zip(ensure(match.players), newPlayerRatings, playerStats)) {
        player.ratingDelta = Math.floor(newRating.mu-stats.rating);
        stats.rating += player.ratingDelta;
        // sigma should never be lower than 25
        stats.sigma = Math.max(25, Math.floor(newRating.sigma));
    }

    await Player.save(ensure(match.players));
    await PlayerStats.save(playerStats);

    return match.getResultEmbed();
}