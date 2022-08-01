import {GuildMember, Permissions} from "discord.js";

import {Player} from "../../entities/matches/Player";
import {PlayerStats} from "../../entities/queues/PlayerStats";
import {ensure} from "../../utils/general";
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
                map: true,
            },
        },
    });

    if (!player) {
        return "Error: Match not found. Please specify match ID and team of an **ongoing** game if you are a moderator";
    }

    const match = ensure(player.match);
    const guild = ensure(match.guild);
    const isModerator = isMod(member, guild);
    await guild.save();

    if (loss && !player.isCaptain && !isModerator) {
        return "Error: Only captains or moderators can report losses";
    } else if (!loss && !isModerator) {
        return "Error: Only moderators can report wins";
    }

    match.winningTeam = loss ? 3 - player.team : player.team; // to get opposite team: 3-2 => 1, 3-1 => 2
    match.endTime = Math.floor(Date.now()/1000);

    if (match.lobbyId === -1) {
        // todo: fetch
        // todo: player civs
        // todo: player colours
    }

    await match.save();

    for (const player of ensure(match.players)) {
        const user = ensure(player.user);
        user.inGame = false;
        user.currentMatch = null;
        await user.save();

        const stats = ensure(await PlayerStats.findOneBy({
            user: {
                discordId: user.discordId,
            },
            leaderboard: {
                matches: {uuid: match.uuid},
            },
        }));

        // todo: using trueskill here
        stats.rating += player.ratingDelta;
        // todo: stats.sigma

        await stats.save();
    }

    return match.resultEmbed;
}