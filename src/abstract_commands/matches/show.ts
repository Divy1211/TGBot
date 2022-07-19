import {MessageEmbed} from "discord.js";

import {Match} from "../../entities/matches/Match";
import {Player} from "../../entities/matches/Player";
import {ensure} from "../../utils/general";

export function getMatchEmbed(match: Match): MessageEmbed {

    return new MessageEmbed()
        .setTitle(`Match ${match.uuid}`)
        .setColor("#ED2939")
        .addFields(
            {
                name: `Team 1`,
                value: `${match.team1.map((player: Player) => `<@${ensure(player.user).discordId}> (${player.rating})`)
                    .join("\n")}`,
                inline: true,
            },
            {
                name: `Team 2`,
                value: `${match.team2.map((player: Player) => `<@${ensure(player.user).discordId}> (${player.rating})`)
                    .join("\n")}`,
                inline: true,
            },
            {
                name: `Map`,
                value: `${ensure(match.map).name}`,
            },
        )
        .setImage(ensure(match.map).imgLink)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/5/55/AoE_Definitive_Edition.png");
}