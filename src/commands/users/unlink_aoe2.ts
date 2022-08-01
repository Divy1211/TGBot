import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {unlinkAoE2} from "../../abstract_commands/users/unlink_aoe2";

export default {
    category: "General",
    description: "Unlink a user's steam/aoe2.net account with discord",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to unlink for. If unspecified, unlink for the user of this command",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, user} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        const discordId = options.getUser("user")?.id ?? user.id;

        return await unlinkAoE2(discordId);
    },
} as ICommand;
