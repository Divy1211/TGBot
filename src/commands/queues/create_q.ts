import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {createQueue} from "../../abstract_commands/queues/create";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isAdmin} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Create a TG pickup queue in this channel",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "name",
            description: "The name of the queue",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "num_players",
            description: "The max number of players for the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
            minValue: 2,
            maxValue: 8,
        },
        {
            name: "pool_uuid",
            description: "The ID of the pool to be used by the queue",
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
        if(!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command"
            })
            return;
        }

        // get the command parameters
        const name = ensure(options.getString("name"));
        const numPlayers = ensure(options.getInteger("num_players"));
        const poolUuid = options.getInteger("pool_uuid") ?? undefined;

        return await createQueue(name, numPlayers, guildId, channelId, poolUuid);
    },
} as ICommand;
