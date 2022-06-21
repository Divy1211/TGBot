import Discord, {Client,Intents,Constants} from 'discord.js'
import { Channel } from 'discord.js';
import dotenv from "dotenv"
import path from "path"
import mongoose from "mongoose"
import WOKCommands from 'wokcommands'
import SQL from 'better-sqlite3'
const sql = new SQL('./discord.sqlite')
import discordModals, { Modal,SelectMenuComponent,TextInputComponent,showModal } from "discord-modals";
import hashcode from "./helper/hash";

dotenv.config();

const client = new Discord.Client(
    {intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS]}
)
discordModals(client);



client.on("ready", async () => {
    console.log("the bot is online");
    const user_table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type ='table' AND name = 'users';").get();
    if (!user_table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE users (id INT PRIMARY KEY, name TEXT, in_game INT, in_queue INT, queue_name TEXT, winning FLOAT);").run();
    // Ensure that the "id" row is always unique and indexed.
    // sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON users (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    }
    const queue_table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type ='table' AND name = 'queues';").get();
        if (!queue_table['count(*)']) {
        sql.prepare("CREATE TABLE queues (id INT PRIMARY KEY, name TEXT, members TEXT, num INT, in_game INT);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");
    let setUser = sql.prepare("INSERT OR REPLACE INTO users \
            (id, name, in_game, in_queue, queue_name, winning) \
            VALUES (@id, @name, @in_game, @in_queue, @queue_name, @winning);");

    // find all users in the server
    const guild = client.guilds.resolve('977789393962160178');
    guild!.members.fetch().then(members =>
        {
            // Loop through every members
            console.log("getting user info...")
            members.forEach(member =>
                {
                    if (!getUser.get(member.user.username)){
                        let user_info = {
                            id: member.user.id,
                            name: member.user.username,
                            in_game:0,
                            in_queue: 0,
                            queue_name: null,
                            winning: 0,
                        }
                        console.log(`storing ${member.user.username}'s info...`)
                        setUser.run(user_info);
                    }   
                    else{
                        console.log(`we have ${member.user.username}'s info`)
                    }
            });
        }   
    );

    new WOKCommands(client, {
        commandsDir: path.join(__dirname,"commands"),
        testServers: "977789393962160178",
        typeScript: true,
    })

})



client.on("modalSubmit",async (modal:any) => {
    // test
    if(modal.customId === 'choosegroup') {
        const nameResponse = modal.getTextInputValue('groupname');
        console.log(nameResponse)
        modal.reply(`You have created the group "${nameResponse}". Awesome!`);
      }  

    // create group handler
    else if (modal.customId === 'creategroup') {
        const name = modal.getTextInputValue('groupname');
        let username = modal.member?.user.username;
        
        let getQueue = sql.prepare("SELECT * FROM queues WHERE name = ?");
        let setQueue = sql.prepare("INSERT INTO queues \
        (id, name, members, num, in_game) \
        VALUES (@id, @name, @members, @num, @in_game);");
        let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");
        let updateUser = sql.prepare(`UPDATE users SET in_queue = 1, queue_name = @queue_name WHERE name = ?;`);

        let user = getUser.get(username)
        // check whether the user is already in a game or in a group
        if (user.in_queue||user.in_game){
            await modal.reply({content: "You are already in a group, please leave the group before creating a new group",ephemeral:true})
        }
        else{
            // check whether the group name has been used
            if (!getQueue.get(name)){
                    // create a new role
                    await modal.guild.roles.create(
                        {
                          name: name,
                          color: "BLUE",
                          hoist: true,
                        },
                      )
                        .then((role:any) => (console.log(role.name)))
                        .catch(console.error);

                    let queue_id = hashcode(name!);
                    setQueue.run({
                        id:queue_id,
                        name:name,
                        num:1,
                        members:modal.member?.user.username,
                        in_game:0,
                    })

                    // assign the role to the user
                    let role = modal.guild.roles.cache.find((r:any) => r.name == name);
                    modal.member.roles.add(role);
                    // update user's state
                    updateUser.run({queue_name:name},username)
                    await modal.reply( {content:`You have created the group ${name}`, ephemeral: true,});
                }
            else{
                await modal.reply( {content:`The group ${name} already exists, please change a name.`, ephemeral: true,});
            }
        }
    }

    // join group handler
    else if (modal.customId === "joingroup") {
        let groupname = modal.getTextInputValue("groupname")
        let getQueue = sql.prepare("SELECT * FROM queues WHERE name = ?");
        let setQueue = sql.prepare("INSERT OR REPLACE INTO queues \
        (id, name, members, num, in_game) \
        VALUES (@id, @name, @members, @num, @in_game);");
        let getUser = sql.prepare("SELECT * FROM users WHERE name = ?");
        let updateUser = sql.prepare(`UPDATE users SET in_queue = 1, queue_name = @queue_name WHERE name = ?;`);

        // check whether the user is already in a group
        if (getUser.get(modal.member?.user.username).in_queue){
            modal.reply({content: "You are already in a group, please leave the group before joining a new group", ephemeral:true})
        }
        else {
            // check whether the group name has been chosen
            let group = getQueue.get(groupname);
            // if the group does not exist
            if (!group){
                modal.reply( {content:`There is no group named ${groupname}, plese choose an existing group`, ephemeral: true,});
            }
            // if the group is in game
            else if (group.in_game){
                modal.reply( {content:`The group is already in game, plese choose another group`, ephemeral: true,});
            }
            // otherwise assign the user to the group and check the number of 
            // players in the group
            else {
                // check whether the player is in the group already
                let username = modal.member?.user.username;
                if (group.members.includes(username)){
                    modal.reply({content:`You are already in the group ${groupname}`,ephemeral: true,})
                }
                else {
                    // assign the user with a role
                    let role = modal.guild.roles.cache.find((r:any) => r.name == groupname);
                    modal.member.roles.add(role);        
                    let num = group.num+1;
                    // inform all players in the queue
                    const playersName = group.members.split("$");
                    
                    let in_game = 0;
                    // check whether there are enough players
                    if (num==process.env.MAX_NUM) {
                        in_game = 1;
                        for (let i=0;i<playersName.length-1;i++){
                            let playerName = playersName[i];
                            try{
                                let player = client.users.cache.find(u => u.username === playerName);
                                player!.send(`There are enough players, you can start the game with \\command`)
                            }
                            catch{
                                console.log(playerName);
                            }
                            
                        }
                    }
                    else {
                        for (let i=0;i<playersName.length-1;i++){
                            let playerName = playersName[i];
                            try{
                                let player = client.users.cache.find(u => u.username === playerName);
                                player!.send(`1 player joined the queue, there are ${num}} remaining players in the queue`)
                            }
                            catch{
                                console.log(playerName);
                            }
                            
                        }
                    }
                    let updated_group = {
                        id: group.id,
                        name: group.name,
                        members: group.members.concat("$",username),
                        num: num,
                        in_game: in_game
                        }
                    setQueue.run(updated_group);
                    updateUser.run({queue_name:groupname},username);
                    modal.reply( {content:`You have joined the group ${groupname}, number of players: ${num}/${process.env.MAX_NUM}`, ephemeral: true,});
                    }
                }
            }   
    }
})

client.login(process.env.DISCORDJS_TOKEN);