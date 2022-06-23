import {BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {PlayerStats} from "../stats/PlayerStats";
import {Queue} from "./Queue";

@Entity()
export class Leaderboard extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @ManyToOne(() => Guild, (guild: Guild) => guild.leaderboards)
    guild?: Guild;

    @OneToMany(() => Queue, (queue: Queue) => queue.leaderboard)
    queue?: Queue[];

    @OneToMany(() => PlayerStats, (playerStats: PlayerStats) => playerStats.leaderboard, {cascade: true, eager: true})
    playerStats!: PlayerStats[];

    constructor();
    constructor(guild: Guild);

    constructor(guild?: Guild) {
        super();

        this.guild = guild;
    }
}