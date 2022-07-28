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

export function getDuration(hhmmss: string): {error?: string, hh: number, mm: number, ss: number} {
    // ss will be undefined if not specified
    let [_, hh, mm, ss]: (string | number)[] = hhmmss.match(/^(\d+):(\d{2})(?::(\d{2}))?$/) ?? ["-1", "-1", "-1", "-1"];
    if (hh === "-1") {
        return {error: "Error: The format of the specified duration is invalid, please try again", hh: 0, mm: 0, ss: 0};
    }

    hh = parseInt(hh);
    mm = parseInt(mm);
    ss = ss ? parseInt(ss) : 0;

    if (ss > 59 && mm > 59) {
        return {error: "Error: Minutes & Seconds cannot be greater than 59", hh, mm, ss};
    }
    if (mm > 59) {
        return {error: "Error: Minutes cannot be greater than 59", hh, mm, ss};
    }
    if (ss > 59) {
        return {error: "Error: Seconds cannot be greater than 59", hh, mm, ss};
    }

    return {hh, mm, ss};
}