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
            description: "The name of the civilization to show winrates for",
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
        const civ: Civ = Civ[ensure(options.getString("civ")).toUpperCase() as CivString] as Civ;

        if (!civ) {
            return `'${options.getString("civ")}' is not a valid civilization`;
        }
        return `Win rate of ${Civ[civ].charAt(0) + Civ[civ].slice(1).toLowerCase()}: \`${await civWinRate(civ)}\``;
    },
} as ICommand;
