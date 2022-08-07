import {Client, Guild} from "discord.js";
import {Ban} from "../entities/user_data/Ban";
import {client} from "../main";
import {User} from "../entities/User";
import {LessThan} from "typeorm";

export default (client:Client) => {
    const check = async () => {
        // const results = await Ban.findBy({
        //     until: LessThan(new Date().getTime()),
        // });
        // let users = await User.find({relations:{guilds:true}});
        // console.log(users)

        // for (const result of results){
        //     const userId = result.user?.discordId;
        //     const guildId = result.guild?.id;
        //     const guild = await client.guilds.fetch(guildId!).then(guild => {
        //         console.log(guild.);
        //         console.log(guild!.members);
        //         guild!.members.unban(userId!, "ban expired");
        //     });
        //     // console.log(guild);
        //     // console.log(guild!.members);
        //     // await guild!.members.unban(userId!, "ban expired");
        // }
        setTimeout(check, 1000*60);
        await Ban.delete({until: LessThan(new Date().getTime())})
    }
    check();
}

export const config = {
    dbName: "Ban",
    displayName: "Banned users",
}