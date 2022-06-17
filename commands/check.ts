// check the state of current group

import { Constants } from "discord.js";
import {ICommand} from "wokcommands";
import dotenv from "dotenv"
import SQL from 'better-sqlite3'
const sql = new SQL('./discord.sqlite')
dotenv.config();

export default {
    category : "Testing",
    description : "allow a user to create a queue",
    options: [],
    slash : true,
    testOnly : true,
    callback : async ({interaction}) => {

        let getQueue = sql.prepare("SELECT * FROM queues WHERE name = ?");
        let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");

        // check if the user is in a group
        let username = interaction.user.username;
        let user = getUser.get(username);
        if (!user.in_queue){
            interaction.reply({content:`You are not in a group yet`, ephemeral:true});
        }
        else {
            let groupname = user.queue_name;
            let group = getQueue.get(groupname);
            interaction.reply({content:`There are ${group.num} players in the group, need ${parseInt(process.env.MAX_NUM!)-group.num} more players`, ephemeral:true})
        }
        
        
    }
} as ICommand