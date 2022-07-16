import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ICommand} from "wokcommands";
import { Pool } from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";

export default {
    category: "General",
    description: "List all the pools in the channel",

    slash: true,
    testOnly: true,

    options: [],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        var pools = await Pool.find();

        // find all maps in the pool
        var all_maps=[];
        for (let i=0; i<pools.length; i++){
            let map = await PoolMap.find({
                where: {pool: {uuid: pools[i].uuid}}
            });
            var maps = map.map(({map})=>`${map.name}`).join(",");
            all_maps.push(maps);
        }
        
        let embed = new MessageEmbed().setDescription("the list of pools in the channel").setColor("#ED2939").setTitle("Pools");
        let fields: EmbedFieldData[] = [];

        fields.push({
            name: "uuid",
            value: pools.map(({uuid})=>`${uuid}`).join("\n"),
            inline: true,
        });

        fields.push({
            name: "name",
            value: pools.map(({name})=>`${name}`).join("\n"),
            inline: true,
        });

        fields.push({
            name: "maps",
            value: all_maps.join('\n'),
            inline: true,
        });

        embed.addFields(fields);
        return embed;
    }
} as ICommand;