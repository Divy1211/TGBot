import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import fetch from "node-fetch";
import {ICommand} from "wokcommands";
import {addMap} from "../../abstract_commands/pools/add_map";


import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isAdmin} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "JSON should be a list of maps which contain a 'uuid' and optionally a 'multiplier' key",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "pool_uuid",
            description: "The uuid of the pool",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "url",
            description: "A URL that returns map objects as JSON. If any map object is invalid, only it will be skipped",
            type: ApplicationCommandOptionTypes.STRING,
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
        if(!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command"
            })
            return;
        }
        await interaction.deferReply();

        // get the command parameters
        const poolUuid = ensure(options.getInteger("pool_uuid"));
        const url = ensure(options.getString("url"));
        let maps;
        try {
            const res = await fetch(url);
            maps = await res.json();
        } catch (e) {
            await interaction.editReply("The provided URL is either invalid or returned bad JSON");
            return;
        }
        let responses: string[] = [];
        for(const map of maps) {
            if(!map["uuid"])
                responses.push("Invalid map object, no uuid");
            responses.push(await addMap(guildId, map["uuid"], poolUuid, map["multiplier"] ?? 1));
        }
        await interaction.editReply(responses.join("\n"));
    },
} as ICommand;