import { Constants } from "discord.js";
import {ICommand} from "wokcommands";
import SQL from 'better-sqlite3'
import remove_name from "../helper/remove_name";

const sql = new SQL('./discord.sqlite')

export default {
    category : "Testing",
    description : "leave the current group",
    slash : true,
    testOnly : true,
    callback : ({interaction,guild}) => {
        let getQueue = sql.prepare("SELECT * FROM queues WHERE name = ?");
        let setQueue = sql.prepare("INSERT OR REPLACE INTO queues \
        (id, name, members, num, in_game) \
        VALUES (@id, @name, @members, @num, @in_game);");
        let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");
        let updateUser = sql.prepare("UPDATE users SET in_queue = 0, queue_name = null WHERE name = ?")

        let user = getUser.get(interaction.member?.user.username)
        // console.log(user.in_queue)
        // check whether the user is already in a group
        if (!user.in_queue){
            interaction.reply({content: "You are not in a group yet", ephemeral:true})
        }
        else {
            // get group information from database
            let group_name = user.queue_name;
            // console.log(group_name)
            let group = getQueue.get(group_name);
            // console.log(group)
            // if the group is in game
            if (group.in_game){
                interaction.reply( {content:`The game has started, you can not leave`, ephemeral: true,});
            }
            // otherwise let the user leave the group
            else {
                // remove the role of the user
                const Role = interaction.guild!.roles.cache.find((r:any) => r.name == group_name);
                let member = guild?.members.cache.get(interaction.user.id)
                member?.roles.remove(Role!)

                // change user's state
                updateUser.run(user.name);
                // change group's state
                // check if the group only have this member
                if (group.num===1){
                    // delete a role
                    let role = interaction.guild!.roles.cache.find((r:any) => r.name == group_name);
                    role?.delete()
                    sql.prepare("DELETE FROM queues WHERE name = ?").run(group_name);
                }
                else {
                    let new_group = {
                        id: group.id,
                        name: group.name,
                        members: remove_name(group.members,user.name),
                        num: group.num-1,
                        in_game: 0,
                    }
                    setQueue.run(new_group)
                }
                interaction.reply({content:`You have leaved the group ${group_name}`,ephemeral:true})

                }
            }     
    }
} as ICommand