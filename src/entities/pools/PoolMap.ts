import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {GameMap} from "./GameMap";
import {Pool} from "./Pool";

@Entity()
export class PoolMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @ManyToOne(() => GameMap, {cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn()
    map!: GameMap;

    @ManyToOne(() => Pool, (pool: Pool) => pool.maps, {onDelete: "CASCADE"})
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