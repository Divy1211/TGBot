import {MessageEmbed} from "discord.js";
import {ICommand} from "wokcommands";
import {client} from "../main";

export default {
    category: "Tools",
    description: "Shows ping information for the bot",

    slash: true,
    testOnly: true,

    callback: async ({interaction}) => {
        // sends a message and checks the difference between the createdTimestamp of the message and original
        // interaction for latency

        const message = await interaction.channel!.send("Testing Ping...");
        message.delete();

        return new MessageEmbed()
            .setColor("#ED2939")
            .setTitle("🏓Ping Information")
            .addFields([
                {
                    name: `Bot Latency`,
                    value: `\`${message.createdTimestamp - interaction.createdTimestamp}ms\``,
                    inline: true,
                },
                {
                    name: "API Latency",
                    value: `\`${client.ws.ping}ms\``,
                    inline: true,
                },
            ]);
    },
} as ICommand;