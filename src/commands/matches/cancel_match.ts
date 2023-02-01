import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {cancelMatch} from "../../abstract_commands/matches/cancel";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isMod} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Cancel the result of a match",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "match_uuid",
            description: "The id of the match to cancel",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "user",
            description: "If specified, only this user will be removed from the queue",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
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
        if (!isMod(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only moderators are allowed to use this command",
            });
            return;
        }

        // get the command parameters
        const uuid = ensure(options.getInteger("match_uuid"));
        const user = options.getUser("user");

        if (user) {
            return await cancelMatch(guildId, uuid, [user.id, ]);
        }

        return await cancelMatch(guildId, uuid);
    },
} as ICommand;
