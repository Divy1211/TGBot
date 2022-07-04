import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {Pool} from "../pools/Pool";
import {User} from "../User";
import {Leaderboard} from "./Leaderboard";

@Entity()
export class Queue extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    name: string;

    @Column()
    numPlayers: number;

    @Column()
    channelId: string;

    @ManyToOne(() => Guild, (guild: Guild) => guild.queues, {cascade: true, onDelete: "CASCADE"})
    guild?: Guild;

    @ManyToMany(() => Pool, (pool: Pool) => pool.queues)
    @JoinTable()
    pools?: Pool[];

    @ManyToMany(() => User, (user: User) => user.queues, {cascade: true, eager: true})
    @JoinTable()
    users!: User[];

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.queue, {cascade: true, onDelete: "CASCADE"})
    leaderboard?: Leaderboard;

    constructor();
    constructor(name: string, guild: Guild, leaderboard: Leaderboard, numPlayers: number, channelId: string);

    constructor(name?: string, guild?: Guild, leaderboard?: Leaderboard, numPlayers?: number, channelId?: string) {
        super();

        this.name = name ?? "";
        this.guild = guild;
        this.leaderboard = leaderboard;
        this.numPlayers = numPlayers ?? -1;
        this.channelId = channelId ?? "";
    }
}