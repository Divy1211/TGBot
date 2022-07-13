import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ensure} from "../../utils/general";
import {GuildMember} from "discord.js";
import {createBan} from "../../abstract_commands/ban/ban";
import {deleteBan} from "../../abstract_commands/ban/unban";

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
        {
            name: "reason",
            description: "The reason you want to unban the user",
            type: ApplicationCommandOptionTypes.STRING,
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
        const member = ensure(options.getMember("user")) as GuildMember;
        const reason = options.getString("reason") ?? "";

        return await deleteBan(member, reason, guildId, channelId);
    },
} as ICommand;
