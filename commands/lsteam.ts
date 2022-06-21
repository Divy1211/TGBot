// see all existing groups

import { ButtonInteraction, Collection, Constants, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import {ICommand} from "wokcommands";
import { Modal,SelectMenuComponent,showModal } from "discord-modals";
import lsnames from "../helper/lsnames";
import SQL from 'better-sqlite3'
const sql = new SQL('./discord.sqlite')

const embeds:MessageEmbed[] = [];
        const pages = {} as {[key: string]:number}
        const numPerPage = 1;

       

export default {
    category : "Testing",
    description : "allow a user see all the existing queues",
    slash : true,
    testOnly : true,
    callback : async ({interaction, channel}) => {

        
        // retreive all queues from the database
        let queues = sql.prepare("SELECT * FROM queues").all();
        let pageLength = Math.ceil(queues.length/numPerPage);
        
        const id = interaction.user.id;
        pages[id] = pages[id] || 0;

        for (let i = 0; i<queues.length; i++){
            let queue = queues[i];
            let groupName = queue.name;
            let number = queue.num;
            let members = lsnames(queue.members)
            embeds.push(new MessageEmbed()
            .setTitle("Team Info")
            .addFields([
                {
                    name:"queue name",
                    value:groupName,
                    inline:true
                },
                {
                    name:"number of players",
                    value:number.toString(),
                    inline:true
                },
                {
                    name:"players",
                    value:members,
                    inline:true
                },
            ]))
        }

        const getRow = (id: string) => {
            const row = new MessageActionRow();
            row.addComponents(
                new MessageButton()
                .setCustomId("prevPage")
                .setStyle("SECONDARY")
                .setEmoji("⬅️")
                .setDisabled(pages[id] === 0),
            
                new MessageButton()
                .setCustomId("nextPage")
                .setStyle("SECONDARY")
                .setEmoji("➡️")
                .setDisabled(pages[id] === pageLength-1)
            )
            return row;
        }
        const filter = (i:Interaction) => i.user.id === interaction.user.id;
        const time = 1000*60*5;
        let collector = channel.createMessageComponentCollector({time:time});
        

        if (queues.length>0){
             await interaction.reply({embeds:embeds.slice(pages[id]*numPerPage,pages[id]*numPerPage+numPerPage),components:[getRow(id)],ephemeral:true})            
        }
        else{
            await interaction.reply({content:`There is no group yet, you can create your own`,ephemeral:true})
        }  

        collector.on("collect", async (btnInt) => {
            if (!btnInt){ return; }
            btnInt.deferUpdate();
            if (btnInt.customId === "prevPage"){
                pages[id]--;
                await interaction.editReply({embeds:embeds.slice(pages[id]*numPerPage,pages[id]*numPerPage+numPerPage),components:[getRow(id)]})            
            }
            else if (btnInt.customId === "nextPage"){
                pages[id]++;
                await interaction.editReply({embeds:embeds.slice(pages[id]*numPerPage,pages[id]*numPerPage+numPerPage),components:[getRow(id)]})            
            }

        })
    }
} as ICommand