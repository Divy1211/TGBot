import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {setRole} from "../../abstract_commands/roles/set_role";

export default {
    category: "Admin",
    description: "Set a role which is pinged for queue promotions on the server",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "role",
            description: "The role to ping when a promotion happens. If unspecified, the role will be unset",
            type: ApplicationCommandOptionTypes.ROLE,
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
        const roleId = options.getRole("role")?.id;

        return await setRole(guildId, "promotion", roleId);
    },
} as ICommand;
