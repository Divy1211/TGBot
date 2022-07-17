import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ensure} from "../../utils/general";
import {unbanUser} from "../../abstract_commands/ban/unban";

export default {
    category: "Admin",
    description: "unban a user",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "user",
            description: "The user want to unban",
            type: ApplicationCommandOptionTypes.USER,
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
        const user = ensure(options.getUser("user"));

        return await unbanUser(user.id,guildId);
    },
} as ICommand;
