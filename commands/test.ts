import { ButtonInteraction, Collection, Constants, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import {ICommand} from "wokcommands";
import { Modal,SelectMenuComponent,TextInputComponent,showModal } from "discord-modals";
import SQL from 'better-sqlite3'
const sql = new SQL('./discord.sqlite')

export default {
    category : "Testing",
    description : "allow a user see all the existing queues",
    slash : true,
    testOnly : true,
    callback : async ({interaction, channel,client}) => {

        // retreive all queues from the database
        let queues = await sql.prepare("SELECT * FROM queues").all();


        const modal = new Modal() // We create a Modal
            .setCustomId('choosegroup')
            .setTitle('CHOOSE A GROUPS')
            .addComponents(
                new TextInputComponent()
                .setCustomId('groupname')
                .setLabel('Give a name to your group')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('Write your group name here')
                .setRequired(true), // If it's required or not

                new TextInputComponent()
                .setCustomId('password')
                .setLabel('Create a password for your group')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('create a password here')
            );
        
        showModal(modal, {
            client:client,
            interaction: interaction
        })

       


        // // create buttons for each group
        // const rows = queues.map(queue => (
        //     new MessageActionRow()
        //     .addComponents(
        //         // click to display the group information
        //         new MessageButton()
        //             .setCustomId(queue.id.toString())
        //             .setLabel(queue.name)
        //             .setStyle('PRIMARY')
        //             .setDisabled(true),
        //         // click to join the group
        //         new MessageButton()
        //             .setCustomId(queue.id.toString().concat("join"))
        //             .setLabel("JOIN")
        //             .setStyle("SUCCESS")
        //     )
        // ))
        

        // interaction.reply({content:"All Groups", components:rows, ephemeral:true})

        // const collector = channel.createMessageComponentCollector({
        //     max:1,
        //     time:1000*200,
        // })

        // collector.on("collect", async (i:ButtonInteraction) => {
        //     let id = i.customId.substring(0,i.customId.length-4)
        //     let getQueue = sql.prepare("SELECT * FROM queues WHERE id = ?");
        //     let setQueue = sql.prepare("INSERT OR REPLACE INTO queues \
        //     (id, name, members, num, in_game) \
        //     VALUES (@id, @name, @members, @num, @in_game);");
        //     let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");
        //     let updateUser = sql.prepare("UPDATE users SET in_queue = 1 WHERE name = ?")

        //     // check whether the user is already in a group
        //     if (getUser.get(i.member?.user.username).in_queue){
        //         await i.reply({content: "You are already in a group, please leave the group before joining a new group", fetchReply: true,ephemeral:true})
        //     }
        //     else {
        //         let group = getQueue.get(id); 
        //         if (group.in_game){
        //             await i.reply( {content:`The group is already in game, plese choose another group`, ephemeral: true,});
        //         }
        //         else {
        //             let num = group.num+1;
        //             let in_game = 0;
        //             if (num==process.env.MAX_NUM) {
        //                 in_game = 1;
        //             }
        //             let updated_group = {
        //                 id: group.id,
        //                 name: group.name,
        //                 members: group.members.concat("$",i.user.username),
        //                 num: num,
        //                 in_game: in_game
        //                 }
        //             setQueue.run(updated_group);
        //             updateUser.run(i.user.username)
        //             await i.reply( {content:`You have joined the group ${group.name}, number of players: ${num}/${process.env.MAX_NUM}`, ephemeral: true,});
        //         }
        //     }

        //     rows.forEach(row => {
        //         row.components[1].setDisabled(true)
        //     })
        //     interaction.editReply({ content: "All Groups", components: rows });
        // })
    }
} as ICommand