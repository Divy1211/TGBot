import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ratingSet} from "../../abstract_commands/ratings/rating_set";
import {ensure} from "../../utils/general";


export default {
    category: "Admin",
    description: "Reset rating for a specific user/leaderboard",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "rating",
            description: "The new rating of the user.",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "user",
            description: "The user to set rating for",
            type: ApplicationCommandOptionTypes.USER,
            required: true,
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
        const rating = ensure(options.getString("rating"));
        const user = options.getUser("user");
        const queueUUID = options.getString("queue_uuid") ?? "";

        let discordId = "";
        if (user){
            discordId = user.id;
        }

        return await ratingSet(discordId, queueUUID, parseInt(rating));
    },
} as ICommand;
