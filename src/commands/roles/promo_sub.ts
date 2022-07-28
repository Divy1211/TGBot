import {GuildMemberRoleManager} from "discord.js";
import {ICommand} from "wokcommands";

import {Guild} from "../../entities/Guild";

export default {
    category: "General",
    description: "Add or remove oneself from the promotion role",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {channelId, guildId, member} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId || !member) {
            return "This command can only be run in a text channel in a server";
        }

        // theres some issues with shifting this to its own function, not so imp tho since this is a discord only
        // command
        const guild = await Guild.findOneBy({id: guildId});
        if (!guild?.promotionRoleId) {
            return "No promotion role set.";
        }

        if (member.roles instanceof GuildMemberRoleManager) {
            if (member.roles.cache.some(role => role.id === guild.promotionRoleId)) {
                member.roles.remove(guild.promotionRoleId);
                return "You have been removed from the promotion role.";
            }

            member.roles.add(guild.promotionRoleId);
            return "You have been added to the promotion role.";
        }

        // by right, this code should never run because the type string[] is no longer used by discord.js
        return "Error: API Error.";
    },
} as ICommand;
