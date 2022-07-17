import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {GameMap} from "./pools/GameMap";
import {Pool} from "./pools/Pool";

import {Leaderboard} from "./queues/Leaderboard";
import {Queue} from "./queues/Queue";
import {User} from "./User";
import {Ban} from "./user_data/Ban";

@Entity()
export class Guild extends BaseEntity {
    @PrimaryColumn()
    id!: string;

    @Column({nullable: true})
    modRoleId?: string;

    @Column({nullable: true})
    adminRoleId?: string;

    @Column({nullable: true})
    promotionRoleId?: string;

    @Column({nullable: true})
    loggingChannelId?: string;

    @Column()
    promotionCooldown: number;

    @Column()
    lastPromotion: number;

    @ManyToMany(() => User, (user: User) => user.guilds)
    @JoinTable()
    users?: User[];

    @OneToMany(() => Ban, (ban: Ban) => ban.guild, {cascade: true})
    bans?: Ban[];

    @OneToMany(() => Queue, (queue: Queue) => queue.guild)
    queues?: Queue[];

    @OneToMany(() => Pool, (pool: Pool) => pool.guild)
    pools?: Pool[];

    @OneToMany(() => GameMap, (gameMap: GameMap) => gameMap.guild)
    maps?: GameMap[];

    @OneToMany(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.guild)
    leaderboards?: Leaderboard[];

    constructor();
    constructor(id: string);

    constructor(id?: string) {
        super();

        this.id = id ?? "";
        this.promotionCooldown = 600;
        this.lastPromotion = -1;
    }
}