import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {GameMap} from "./GameMap";
import {Pool} from "./Pool";

@Entity()
export class PoolMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @OneToOne(() => GameMap, {cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn()
    map!: GameMap;

    @ManyToOne(() => Pool, (pool: Pool) => pool.maps, {onDelete: "CASCADE"})
    pool?: Pool;

    @Column()
    multiplier: number;


    @Column()
    numTotal: number;

    @Column()
    numClicked: number;

    @Column()
    numShown: number;

    @Column()
    numChosen: number;

    constructor();
    constructor(map: GameMap, pool: Pool, multiplier: number);

    constructor(map?: GameMap, pool?: Pool, multiplier?: number) {
        super();
        this.map = map ?? new GameMap();
        this.pool = pool;
        this.multiplier = multiplier ?? 1;

        this.numTotal = 0;
        this.numClicked = 0;

        this.numShown = 0;
        this.numChosen = 0;
    }
}