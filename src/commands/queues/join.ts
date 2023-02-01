import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {joinQueue} from "../../abstract_commands/queues/join";
import {User} from "../../entities/User";
import {Guild} from "../../entities/Guild";
import {isMod} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "User",
    description: "Join a queue",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue to join",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: "user",
            description: "Make this user join the queue",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, member} = interaction;

        let {user} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const uuid = options.getInteger("queue_uuid") ?? undefined;
        user = options.getUser("user") ?? user;

        if (options.getUser("user")) {
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
        }

        return await joinQueue(user.id, channelId, guildId, options.getUser("user") !== null, uuid);
    },
} as ICommand;
