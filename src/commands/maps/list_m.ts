import { assert } from "console";
import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import { GameMap } from "../../entities/pools/GameMap";
import { Pool } from "../../entities/pools/Pool";
import {PoolMap} from "../../entities/pools/PoolMap";
import {Queue} from "../../entities/queues/Queue"

export default {
    // THIS COMMAND IS ONLY CAPABLE FOR POOL FINDING NOW
    category: "General",
    description: "List all the maps used by a queue or a pool",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "the id of the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
        {
            name: "pool_uuid",
            description: "The id if the pool",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const queue_uuid = options.getInteger("queue_uuid") ?? 0;
        const pool_uuid = options.getInteger("pool_uuid") ?? 0;

        const queue_in = await Queue.findOneBy({uuid: queue_uuid, channelId: channelId});
        const pool_in = await Pool.findOneBy({uuid: pool_uuid});

        var target_pools: Pool[] = [];
        var description = "";
        
        // neither queue nor pool was found
        if (!queue_in && !pool_in){
            return `The queue id or pool id were not found in this channel`;
        }

        // both queue and pool are found
        else if (queue_in && pool_in){
            if (!queue_in.pools?.includes(pool_in)){
                // found pool is not in the queue's pools
                return `queue id and pool id do not match with each other`;
            }
            // found pool is in the queue's pools
            target_pools.push(pool_in);
            description = `Map contained in pool ${pool_in.uuid}`
        }

        // only queue or pool is found 
        else if (queue_in){
            // only queue
            if (queue_in.pools){
                target_pools = queue_in.pools;
                description = `Maps contained in queue ${queue_in.uuid}`
            }
        }
        else if (pool_in){
            target_pools.push(pool_in);
            description = `Maps contained in pool ${pool_in.uuid}`
        }

        // find all maps from targeted pools
        var maps: PoolMap[] = [];
        for (let i=0; i<target_pools.length; i++){
            let pool_maps = await PoolMap.find({
                where:{
                    pool: {uuid: target_pools[i].uuid}
                }
            })
            for (let i=0; i<pool_maps.length; i++){
                if (!maps.includes(pool_maps[i])){
                    maps.push(pool_maps[i])
                }
            }
        }

        if (maps.length == 0){
            return `The pool is empty.`
        }

        // find GameMaps based on PoolMaps
        var game_maps: GameMap[] = [];
        for (let i=0; i<maps.length; i++){
            let find = await GameMap.findOneBy({uuid: maps[i].map.uuid});
            game_maps.push(find!);
        }
        

        let embed = new MessageEmbed().setDescription(description).setColor("#ED2939").setTitle("Maps")
        let fields: EmbedFieldData[] = [];
        fields.push({
            name: "mapUuid",
            value: game_maps.map(({uuid})=>`${uuid}`).join("\n"),
            inline: true,
        })
        fields.push({
            name: "name",
            value: game_maps.map(({name})=>`${name}`).join("\n"),
            inline: true,
        })
        // fields.push({
        //     name: "multiplayer",
        //     value: maps.map(({multiplier})=>multiplier).join("\n"),
        //     inline: true,
        // })

        embed.addFields(fields);
        return embed;
    }
} as ICommand;