import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {statsReset} from "../../abstract_commands/ratings/stats_reset";

export default {
    category: "Admin",
    description: "Reset rating for a specific user/leaderboard",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to reset rating for",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "queue_uuid",
            description: "The leaderboard to reset the rating for",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const user = options.getUser("user");
        const queueUUID = options.getString("queue_uuid") ?? "";

        let discordId = "";
        if (user){
            discordId = user.id;
        }

        return await statsReset(discordId, queueUUID);
    },
} as ICommand;
