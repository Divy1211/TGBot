import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {reset} from "../../abstract_commands/ratings/reset";
import {Guild} from "../../entities/Guild";
import {isMod} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Reset statistics for a user/queue",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user to reset statistics for. If unspecified, resets the statistics of all users",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "queue_uuid",
            description: "The queue to reset the statistics for. If unspecified, resets the statistics in all queues",
            type: ApplicationCommandOptionTypes.INTEGER,
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
        if(!isMod(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only moderators are allowed to use this command"
            })
            return;
        }

        // get the command parameters
        const discordId = options.getUser("user")?.id;
        const queueUuid = options.getInteger("queue_uuid") ?? undefined;

        return await reset(guildId, discordId, queueUuid, {stats: true});
    },
} as ICommand;
