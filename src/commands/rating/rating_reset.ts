import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {reset} from "../../abstract_commands/ratings/reset";

export default {
    category: "Admin",
    description: "Reset ratings for a user/queue",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to reset ratings for. If unspecified, resets the ratings of all users",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "queue_uuid",
            description: "The queue to reset the ratings for. If unspecified, resets the ratings in all queues",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        const discordId = options.getUser("user")?.id;
        const queueUuid = options.getInteger("queue_uuid") ?? undefined;

        return await reset(guildId, discordId, queueUuid, {rating: true});
    },
} as ICommand;