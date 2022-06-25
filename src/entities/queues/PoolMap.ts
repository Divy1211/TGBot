import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {GameMap} from "./GameMap";
import {Pool} from "./Pool";

@Entity()
export class PoolMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @OneToOne(() => GameMap, {eager: true})
    @JoinColumn()
    map!: GameMap;

    @ManyToOne(() => Pool, (pool: Pool) => pool.maps)
    pool?: Pool;

    @Column()
    multiplier: number;

    constructor();
    constructor(map: GameMap, pool: Pool, multiplier: number);

    constructor(map?: GameMap, pool?: Pool, multiplier?: number) {
        super();
        this.map = map ?? new GameMap();
        this.pool = pool;
        this.multiplier = multiplier ?? 1;
    }
}