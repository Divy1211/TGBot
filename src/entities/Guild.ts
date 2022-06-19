import {BaseEntity, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";

import {Leaderboard} from "./Leaderboard";
import {Queue} from "./Queue";
import {User} from "./User";

@Entity()
export class Guild extends BaseEntity {
    @PrimaryColumn()
    serverId: string;

    @ManyToMany(() => User, (user: User) => user.guilds)
    @JoinTable()
    users!: User[];

    @OneToMany(() => Queue, (queue: Queue) => queue.guild)
    queues!: Queue[];

    @OneToMany(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.guild)
    leaderboards!: Leaderboard[];

    constructor(serverId: string) {
        super();
        this.serverId = serverId;
    }
}