import {MessageEmbed} from "discord.js";

import {Match} from "../../entities/matches/Match";

/**
 * Shows the detialed information for the given match in the specified server
 *
 * @param guildId The server that the command was run in.
 * @param matchUuid The ID of the match to show the details for.
 */
export async function showMatch(guildId: string, matchUuid: number): Promise<string | MessageEmbed> {
    const match = await Match.findOne({
        where: {
            uuid: matchUuid,
            guild: {id: guildId},
        },
        relations: {
            players: {
                user: true,
            },
        },
    });
    if (!match) {
        return `Match with ID ${matchUuid} does not exist in this server`;
    }

    return match.getResultEmbed(true);
}