import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {setPromoCooldown} from "../../abstract_commands/roles/set_promo_cd";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Set the cooldown for pinging the promotion role on the server. 10 minutes by default",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "cooldown",
            description: "The duration for the cooldown in hh:mm[:ss] format",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const cooldown = ensure(options.getString("cooldown"));

        return await setPromoCooldown(guildId, cooldown);
    },
} as ICommand;
