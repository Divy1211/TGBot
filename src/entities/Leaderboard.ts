import {BaseEntity, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "./Guild";
import {Queue} from "./Queue";
import {PlayerStatistics} from "./stats/PlayerStatistics";

@Entity()
export class Leaderboard extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @ManyToOne(() => Guild, (guild: Guild) => guild.leaderboards)
    guild!: Guild;

    @OneToOne(() => Queue, (queue: Queue) => queue.leaderboard)
    queue!: Queue;

    @ManyToOne(() => PlayerStatistics, (playerStatistics: PlayerStatistics) => playerStatistics.leaderboard)
    playerStatistics!: PlayerStatistics[];

    constructor(guild: Guild) {
        super();
        this.guild = guild;
    }
}