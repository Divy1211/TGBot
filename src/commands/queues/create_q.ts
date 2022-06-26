import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {Guild} from "../../entities/Guild";
import {Leaderboard} from "../../entities/queues/Leaderboard";
import {Queue} from "../../entities/queues/Queue";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "Create a TG pickup queue in this channel",

    slash: true,
    testOnly: true,

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
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        // get the command parameters
        const name = ensure(options.getString("name"));
        const numPlayers = ensure(options.getInteger("num_players"));

        let guild = await Guild.findOneBy({id: guildId});
        if (!guild)
            guild = new Guild(guildId);

        const queue = new Queue(name, guild, new Leaderboard(guild), numPlayers, channelId);
        await queue.save();

        return `Queue "${name}" has been created successfully!`;
    },
} as ICommand;