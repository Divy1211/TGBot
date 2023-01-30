import {ICommand} from "wokcommands";
import {setLoggingChannel} from "../abstract_commands/logging_channel";
import {Guild} from "../entities/Guild";
import {isAdmin} from "../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Set this channel as the logging channel for bot command usages on this server",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {channelId, guildId, member} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        let guild = await Guild.findOneBy({id: guildId});
        if (!guild) {
            guild = new Guild(guildId);
        }
        if (!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command",
            });
            return;
        }

        return await setLoggingChannel(guildId, channelId);
    },
} as ICommand;
