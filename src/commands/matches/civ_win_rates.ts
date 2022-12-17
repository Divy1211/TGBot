import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {civWinRate} from "../../abstract_commands/matches/civ_win_rate";

import {Civ, CivString} from "../../interfaces/Civ";
import {ensure} from "../../utils/general";

export default {
    category: "General",
    description: "Calculate the win rates for a specific civilization across all games",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "civ",
            description: "The id of the match to cancel",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
            choices: [

            ],
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;
        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const civ: Civ = ensure(options.getInteger("civ")) as Civ;

        return await civWinRate(civ);
    },
} as ICommand;
