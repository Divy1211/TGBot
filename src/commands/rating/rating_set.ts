import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {ratingSet} from "../../abstract_commands/ratings/rating_set";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isMod} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";


export default {
    category: "Moderators",
    description: "Set the rating for a user for a specific queue",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "rating",
            description: "The new rating of the user",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "user",
            description: "The user to set rating for",
            type: ApplicationCommandOptionTypes.USER,
            required: true,
        },
        {
            name: "queue_uuid",
            description: "The queue to set the rating for",
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
        if (!isMod(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only moderators are allowed to use this command",
            });
            return;
        }

        // get the command parameters
        const rating = ensure(options.getInteger("rating"));
        const discordId = ensure(options.getUser("user")?.id);
        const queueUuid = options.getInteger("queue_uuid") ?? undefined;

        return await ratingSet(discordId, rating, channelId, queueUuid);
    },
} as ICommand;
