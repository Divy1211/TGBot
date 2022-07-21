import {MessageActionRow, MessageButton} from "discord.js";
import {Match} from "../../entities/matches/Match";
import {Player} from "../../entities/matches/Player";
import {client} from "../../main";
import {ensure} from "../../utils/general";
import {cancelMatch} from "./cancel";
import {sendOptionsMessage} from "./send_options";
import {getMatchEmbed} from "./show";

/**
 * Generates the map voting button interface for the given match
 *
 * @param match The match to generate the voting interface for
 */
export async function setupVotingOptions(match: Match): Promise<void> {
    const channel = await client.channels.fetch(ensure(match.queue).channelId);
    if (!channel?.isText()) {
        return;
    }

    let msg = await sendOptionsMessage(match, channel);

    // create a vote listener with a time limit of 5 minutes and filter events by the users in the game only.
    const playerDiscordIds = ensure(match.players).map((player: Player) => ensure(player.user).discordId);
    const votes = channel.createMessageComponentCollector({
        filter: (buttonInteraction) => playerDiscordIds.includes(buttonInteraction.user.id),
        time: 1000 * 60 * 5, // time in ms, 5 minute time out
    });

    // the actual vote listener
    votes.on("collect", async (vote) => {
        const player = await match.setReady(vote.user.id);

        // update the list of players that need to vote in the original message
        await msg.edit([
            `Match \`${match.uuid}\` started! The following players need to vote:`,
            `<@${match.unreadyPlayers.join(">\n<@")}>`,
            `If someone does not vote, this match will cancel <t:${match.startTime + 5 * 60}:R>!`,
        ].join("\n"));


        if (vote.customId === "reroll") {
            try {
                vote.reply({
                    ephemeral: true,
                    content: match.voteReroll(player),
                }).then();
            } catch (e) {
            }

            // if the vote count for rerolls reaches a majority, actually reroll
            if (match.numVotesReroll >= ensure(match.players).length / 2) {
                match.numVotesReroll = 0;
                match.regenMapOptions();

                await match.unreadyAll();

                await msg.delete();
                msg = await sendOptionsMessage(match, channel, false);
            }
            await match.save();

        } else if (vote.customId === "cancel") {
            try {
                await vote.deferUpdate();
            } catch (e) {
            }

            await msg.edit({
                content: `<@${vote.user.id}> cancelled the match, reverting to the queue stage...`,
                components: [],
            });

            cancelMatch(match.uuid, [vote.user.id]).then();

        } else {
            const mapOption = match.getMapOptionByName(vote.customId);
            try {
                vote.reply({
                    ephemeral: true,
                    content: mapOption.updateVote(player),
                }).then();
            } catch (e) {
            }

            await mapOption.save();

            if (match.unreadyPlayers.length === 0) {
                match.determineMap();

                await msg.edit({
                    content: null,
                    embeds: [getMatchEmbed(match)],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel("Join")
                                .setURL("https://aoe2.net/j/123456789")
                                .setStyle("LINK")
                                .setEmoji("🎮"),

                            new MessageButton()
                                .setLabel("Spectate")
                                .setURL("https://aoe2.net/s/123456789")
                                .setStyle("LINK")
                                .setEmoji("👓"),
                        ),
                    ],
                });

                await match.save();
            }
        }
    });

    // this callback is run when the 5-minute timer runs out
    votes.on("end", async () => {
        const unreadyPlayers = ensure(match.players)
            .filter((player: Player) => !player.isReady)
            .map((player: Player) => ensure(player.user).discordId);

        if (unreadyPlayers.length > 0) {
            await msg.edit({
                content: `<@${unreadyPlayers.join(">, <@")}> did not vote in time, aborting match...`,
                components: [],
            });
            cancelMatch(match.uuid, unreadyPlayers).then();
        }
    });
}