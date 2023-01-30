import {BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {Match} from "../matches/Match";
import {PlayerStats} from "./PlayerStats";
import {Queue} from "./Queue";

@Entity()
export class Leaderboard extends BaseEntity {
    @PrimaryGeneratedColumn()
        uuid!: number;

    @ManyToOne(() => Guild, (guild: Guild) => guild.leaderboards, {onDelete: "CASCADE"})
        guild?: Guild;

    @OneToMany(() => Queue, (queue: Queue) => queue.leaderboard)
        queue?: Queue[];

    @OneToMany(() => PlayerStats, (playerStats: PlayerStats) => playerStats.leaderboard, {cascade: true, eager: true})
        playerStats!: PlayerStats[];

    @OneToMany(() => Match, (match: Match) => match.leaderboard)
        matches?: Match[];

    constructor ();
    constructor (guild: Guild);

    constructor (guild?: Guild) {
        super();

        this.guild = guild;
    }
}
