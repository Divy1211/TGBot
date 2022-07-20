import {Message, MessageActionRow, MessageButton, TextBasedChannel} from "discord.js";
import {MapOption} from "../../entities/matches/MapOption";
import {Match} from "../../entities/matches/Match";
import {ensure} from "../../utils/general";

/**
 * Sends and returns a message with the map options voting button interface
 *
 * @param match The match to generate the  voting options for
 * @param channel The channel to send the options in
 * @param reroll If set to false, the option to reroll won't be generated
 */
export async function sendOptionsMessage(
    match: Match,
    channel: TextBasedChannel,
    reroll: boolean = true,
): Promise<Message> {
    let mapRow1: MessageActionRow = new MessageActionRow();
    let linkRow1: MessageActionRow = new MessageActionRow();
    let mapRow2: MessageActionRow = new MessageActionRow();
    let linkRow2: MessageActionRow = new MessageActionRow();

    ensure(match.mapOptions).forEach((option: MapOption, i: number) => {
        let mapRow = i <= 2 ? mapRow1 : mapRow2;
        let linkRow = i <= 2 ? linkRow1 : linkRow2;
        mapRow.addComponents(
            new MessageButton()
                .setCustomId(option.map.name)
                .setLabel(`${option.map.name}\_\_\_\_`)
                .setStyle("PRIMARY"),
        );
        linkRow.addComponents(
            new MessageButton()
                .setLabel(option.map.name)
                // we are not removing this default link. period.
                .setURL(option.map.imgLink ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                .setStyle("LINK"),
        );
    });

    linkRow2.addComponents(
        new MessageButton()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle("DANGER"),
    );
    if (reroll) {
        mapRow2.addComponents(
            new MessageButton()
                .setCustomId("reroll")
                .setLabel("Re-Roll")
                .setStyle("SUCCESS"),
        );
    }

    return await channel.send({
        content: [
            `Match \`${match.uuid}\` started! The following players need to vote:`,
            `<@${match.unreadyPlayers.join(">\n<@")}>`,
            `If someone does not vote, this match will cancel <t:${match.startTime + 5 * 60}:R>!`,
        ].join("\n"),
        components: [mapRow1, linkRow1, mapRow2, linkRow2],
    });
}