import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "./Guild";
import {Leaderboard} from "./Leaderboard";
import {User} from "./User";

@Entity()
export class Queue extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    numPlayers: number;

    @Column()
    channelId: string;

    @ManyToOne(() => Guild, (guild: Guild) => guild.queues, {cascade: true})
    guild: Guild;

    @OneToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.queue, {cascade: true})
    @JoinTable()
    leaderboard: Leaderboard;

    @ManyToMany(() => User, (user) => user.queues, {cascade: true, eager: true})
    @JoinTable()
    users!: User[];

    constructor(guild: Guild, leaderboard: Leaderboard, numPlayers: number, channelId: string) {
        super();
        this.guild = guild;
        this.leaderboard = leaderboard;
        this.numPlayers = numPlayers;
        this.channelId = channelId;
    }
}