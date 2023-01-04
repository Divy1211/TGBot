import {CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {ensure, enumerate} from "./general";

/**
 * Get the button message action row for flipping pages in embeds
 *
 * @param start If viewing starting page
 * @param end If viewing ending page
 */
function getFlipButtons({start = false, end = false}) {
    return new MessageActionRow().addComponents(
        [
            new MessageButton()
            .setCustomId("prev_page")
            .setStyle("SECONDARY")
            .setEmoji("⬅")
            .setDisabled(start),
            new MessageButton()
            .setCustomId("next_page")
            .setStyle("SECONDARY")
            .setEmoji("➡")
            .setDisabled(end)
        ]
    );
}

/**
 * Creates pages from an array of embeds
 *
 * @param embeds The array of embeds to create pages from
 * @param interaction The command interaction to reply to
 */
export async function generatePaginatedEmbed(embeds: MessageEmbed[], interaction: CommandInteraction): Promise<void> {
    if(embeds.length === 1) {
        await interaction.reply({
            embeds: [embeds[0]],
            ephemeral: true,
        })
        return;
    }

    for(let [i, embed] of enumerate(embeds)) {
        const title = embed.title;
        embed.setTitle(`${title} (${i+1}/${embeds.length})`);
    }

    let page: number = 0;
    await interaction.reply({
        embeds: [embeds[page]],
        components: [getFlipButtons({ start: true })],
        ephemeral: true
    })

    const flip = ensure(interaction.channel).createMessageComponentCollector({
        filter: buttonInteraction => interaction.user.id === buttonInteraction.user.id,
        time: 1000 * 60 * 5, // time in ms, 5 minute time out
    });
    flip.on("collect", async (flip) => {
        flip.deferUpdate()
        if(flip.customId === "next_page") {
            await interaction.editReply({
                embeds: [embeds[++page]],
                components: [getFlipButtons({end: page === embeds.length-1})],
            })
        } else if(flip.customId === "prev_page") {
            await interaction.editReply({
                embeds: [embeds[--page]],
                components: [getFlipButtons({start: page === 0})],
            })
        }
    });
    flip.on("end", async () => {
        await interaction.editReply({
            embeds: [embeds[page]],
            components: [],
        });
    });
}