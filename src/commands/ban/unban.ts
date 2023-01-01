import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {unbanUser} from "../../abstract_commands/ban/unban";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isMod} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Unban a user",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to unban",
            type: ApplicationCommandOptionTypes.USER,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, member} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        let guild = await Guild.findOneBy({id: guildId});
        if (!guild) {
            guild = new Guild(guildId);
        }
        if(!isMod(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only moderators are allowed to use this command"
            })
            return;
        }

        // get the command parameters
        const user = ensure(options.getUser("user"));

        return await unbanUser(user.id, guildId);
    },
} as ICommand;
