import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ensure} from "../utils/general";


/**
 * Return an integer between min and max (both included)
 *
 * @param min the minimum value of the random number
 * @param max the maximum value of the random number
 */
 function generateRandomNum(min: number, max: number): number {
    return Math.floor(Math.random()*(max-min+1)) + min;
}

export default {
    category: "User",
    description: "Generate a random number",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "max",
            description: "The maximum value of the random number",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "min",
            description: "The minimum value of the random number",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options} = interaction;
        const min = options.getInteger("min") ?? 0;
        const max = ensure(options.getInteger("max"));
        let generatedNum = generateRandomNum(min, max);
        return `${generatedNum}`;
    },
} as ICommand;