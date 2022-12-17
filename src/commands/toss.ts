import {ICommand} from "wokcommands";

/**
 * Return an integer between min and max (both included)
 *
 */
function toss(): number {
    return Math.round(Math.random());
}


export default {
    category: "User",
    description: "Flip a coin",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [],

    callback: async ({}) => {
        let coin = toss();
        if (coin === 1) {
            return "heads";
        }
        return "tails";
    },
} as ICommand;