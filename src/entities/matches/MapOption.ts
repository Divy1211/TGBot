import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PoolMap} from "../pools/PoolMap";
import {Match} from "./Match";

@Entity()
export class MapOption extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    numVotes: number;

    @OneToOne(() => PoolMap, {eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    map?: PoolMap;

    @ManyToOne(() => Match, (match: Match) => match.mapOptions, {onDelete: "CASCADE"})
    match: Match;

    constructor();
    constructor(map: PoolMap, match: Match);

    constructor(map?: PoolMap, match?: Match) {
        super();

        this.numVotes = 0;
        this.map = map;
        this.match = match ?? new Match();
    }
}