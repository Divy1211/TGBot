import {MessageEmbed} from "discord.js";

import {Match} from "../../entities/matches/Match";
import {ensure} from "../../utils/general";

/**
 * List all the matches played in the server
 *
 * @param guildId The ID of the server in which the command is run
 * @param showMatchIds If true, show the IDs of the matches
 */
export async function listMatches(guildId: string, showMatchIds?: boolean) {
    const matches = await Match.find({
        where: {
            guild: {id: guildId},
        },
        relations: {
            players: true,
        },
    });

    let embed = new MessageEmbed()
        .setTitle("Matches")
        .setColor("#ED2939");

    if (matches.length === 0) {
        embed.setDescription("No matches found");
        return embed;
    }

    if (showMatchIds) {
        embed.addFields([
            {
                name: "ID",
                value: matches.map((match: Match) => `\`${match.uuid}\``).join("\n"),
                inline: true,
            },
        ]);
    }

    embed.addFields([
        {
            name: "Map",
            value: matches.map((match: Match) => match.map?.hyperlinkedName ?? "Undecided").join("\n"),
            inline: true,
        },
        {
            name: "Num Players    Status",
            value: matches.map((match: Match) => `\`      ${ensure(match.players).length}     \` ${match.status}`).join("\n"),
            inline: true,
        },
    ]);
    return embed;
}