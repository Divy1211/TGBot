import {BaseEntity, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";

import {Leaderboard} from "./queues/Leaderboard";
import {Queue} from "./queues/Queue";
import {User} from "./User";

@Entity()
export class Guild extends BaseEntity {
    @PrimaryColumn()
    id!: string;

    @ManyToMany(() => User, (user: User) => user.guilds)
    @JoinTable()
    users?: User[];

    @OneToMany(() => Queue, (queue: Queue) => queue.guild)
    queues?: Queue[];

    @OneToMany(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.guild)
    leaderboards?: Leaderboard[];

    constructor();
    constructor(id: string);

    constructor(id?: string) {
        super();

        this.id = id ?? "";
    }
}