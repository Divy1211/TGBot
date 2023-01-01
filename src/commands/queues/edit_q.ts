import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {editQueue} from "../../abstract_commands/queues/edit";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isAdmin} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Edit the information of a specific queue",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "name",
            description: "The name of the queue",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "num_players",
            description: "The max number of players for the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
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
        const uuid = ensure(options.getInteger("queue_uuid"));
        const name = options.getString("name") ?? undefined;
        const numPlayers = options.getInteger("num_players") ?? undefined;
        const poolUuid = options.getInteger("pool_uuid") ?? undefined;

        return await editQueue(uuid, channelId, {name, numPlayers, poolUuid});
    },
} as ICommand;