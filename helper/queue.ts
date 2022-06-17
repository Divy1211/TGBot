import {User} from "discord.js"
class Queue{
    name:string = "";
    members:User[] = [];
    num:number = 0;
    constructor(name: string){
        this.name = name;
    }
    add(user:User){
        if (!this.members.includes(user)){
            if (this.num<8){
                this.members.push(user);
                this.num += 1;
                console.log(`the # of ppl in the queue is ${this.num}`)
            }
            else {
                console.log("the queue in full")
                // user.send({});
            }
        }
    }
    drop(){

    }
}

export default Queue