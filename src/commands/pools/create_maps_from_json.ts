import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import fetch from "node-fetch";
import {ICommand} from "wokcommands";

import {createMap} from "../../abstract_commands/pools/create_map";
import {ensure} from "../../utils/general";

export default {
    category: "Admin",
    description: "JSON should be a list of maps which contain a 'name' and optionally an 'img_link' key",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "url",
            description: "A URL that returns map objects as JSON. If any map object is invalid, only it will be skipped",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const url = ensure(options.getString("url"));
        let maps;
        try {
            maps = await (await fetch(url)).json();
        } catch (e) {
            return "The provided URL is either invalid or returned bad JSON"
        }
        let responses: string[] = [];
        for(const map of maps) {
            if(!map["name"])
                responses.push("Invalid map object, no name");
            responses.push(await createMap(guildId, map["name"], map["img_link"] ?? undefined));
        }
        return responses.join("\n");
    },
} as ICommand;