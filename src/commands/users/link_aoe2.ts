import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {linkAoE2} from "../../abstract_commands/users/link_aoe2";

export default {
    category: "General",
    description: "Link a user's steam/aoe2.net account with discord",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "steam_id",
            description: "The steam ID of the user",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "aoe2_net_profile_id",
            description: "The aoe2.net profile ID of the user",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "user",
            description: "The user to link for. If unspecified, link for the user of this command",
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
        const steamId = options.getString("steam_id") ?? undefined;
        const profileId = options.getString("aoe2_net_profile_id") ?? undefined;

        await interaction.deferReply();
        await interaction.editReply(await linkAoE2(discordId, steamId, profileId));
    },
} as ICommand;
