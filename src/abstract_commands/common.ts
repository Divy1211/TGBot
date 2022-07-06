import {MessageEmbed} from "discord.js";

import {Queue} from "../entities/queues/Queue";

/**
 * Get an embed to show the players in the given queue
 *
 * @param queue the queue to show the players for
 */
export function getPlayerEmbed(queue: Queue): MessageEmbed {
    return new MessageEmbed()
        .setTitle(queue.name)
        .setColor("#ED2939")
        .addFields(
            {
                name: `Players ${queue.users.length}/${queue.numPlayers}`,
                value: queue.users.map((user, i) => {
                    return `${i + 1}. <@${user.discordId}>`;
                }).join("\n") || "No players in queue",
            },
        );
}