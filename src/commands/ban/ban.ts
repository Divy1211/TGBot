import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ensure} from "../../utils/general";
import {GuildMember} from "discord.js";
import {createBan} from "../../abstract_commands/ban/ban";

export default {
    category: "Admin",
    description: "ban a user",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "user",
            description: "The user want to ban",
            type: ApplicationCommandOptionTypes.USER,
            required: true,
        },
        {
            name: "duration",
            description: "The duration you want to ban the user",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "reason",
            description: "The reason you want to ban the user",
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
        const duration = options.getString("duration")
        const reason = options.getString("reason") ?? "";

        return await createBan(member, duration, reason, guildId, channelId);
    },
} as ICommand;
