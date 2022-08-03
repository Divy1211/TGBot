import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {Queue} from "../queues/Queue";
import {PoolMap} from "./PoolMap";

@Entity()
export class Pool extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    name: string;

    @ManyToOne(() => Guild, (guild: Guild) => guild.leaderboards, {onDelete: "CASCADE"})
    guild?: Guild;

    @ManyToMany(() => Queue, (queue: Queue) => queue.pools)
    queues?: Queue[];

    @OneToMany(() => PoolMap, (poolMap: PoolMap) => poolMap.pool, {cascade: true, eager: true})
    poolMaps!: PoolMap[];

    constructor();
    constructor(name: string, guild: Guild);

    constructor(name?: string, guild?: Guild) {
        super();

        this.name = name ?? "";
        this.guild = guild;
    }
}