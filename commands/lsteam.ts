// see all existing groups

import { ButtonInteraction, Collection, Constants, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import {ICommand} from "wokcommands";
import { Modal,SelectMenuComponent,showModal } from "discord-modals";
import lsnames from "../helper/lsnames";
import SQL from 'better-sqlite3'
const sql = new SQL('./discord.sqlite')

export default {
    category : "Testing",
    description : "allow a user see all the existing queues",
    slash : true,
    testOnly : true,
    callback : async ({interaction, channel}) => {

        // retreive all queues from the database
        let queues = await sql.prepare("SELECT * FROM queues").all();
        let str = ""
        for (let i=0;i<queues.length;i++){
            let queue = queues[i];
            let group_name = queue.name;
            let number = queue.num;
            let members = lsnames(queue.members)
            str += `${group_name}\t${number}/8\t${members}\n`
        }
        if (str){
            interaction.reply({content:str,ephemeral:true})
        }
        else{
            interaction.reply({content:`There is no group yet, you can create your own`,ephemeral:true})
        }  
    }
} as ICommand