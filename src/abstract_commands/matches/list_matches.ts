import {MessageEmbed} from "discord.js";

import {Match} from "../../entities/matches/Match";
import {ensure} from "../../utils/general";

/**
 * List all the matches played in the server
 *
 * @param guildId The ID of the server in which the command is run
 * @param showMatchIds If true, show the IDs of the matches
 */
export async function listMatches(guildId: string, showMatchIds?: boolean): Promise<MessageEmbed[]> {
    const allMatches = await Match.find({
        where: {
            guild: {id: guildId},
        },
        relations: {
            players: true,
        },
    });

    if (allMatches.length === 0) {
        return [
            new MessageEmbed()
                .setTitle("Matches")
                .setDescription("No matches found")
                .setColor("#ED2939")
        ];
    }

    let embeds: MessageEmbed[] = [];
    let embed = new MessageEmbed();
    for(let i = 0; i < allMatches.length; i+=10) {
        const matches = allMatches.slice(i, i+10);
        if(i%10 === 0) {
            embed = new MessageEmbed()
                .setTitle("Matches")
                .setColor("#ED2939")
            embeds.push(embed);
        }

        if (showMatchIds) {
            embed.addFields([
                {
                    name: "ID",
                    value: matches.map((match: Match) => `${match.uuid}`).join("\n"),
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
    }
    return embeds;
}