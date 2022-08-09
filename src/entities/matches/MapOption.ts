import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import {GameMap} from "../pools/GameMap";
import {Match} from "./Match";
import {Player} from "./Player";

@Entity()
export class MapOption extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    numVotes: number;

    @ManyToOne(() => Match, (match: Match) => match.mapOptions, {onDelete: "CASCADE"})
    match: Match;

    @ManyToOne(() => GameMap, {eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    map: GameMap;

    @ManyToMany(() => Player, {eager: true})
    @JoinTable()
    players!: Player[];

    constructor();
    constructor(map: GameMap, match: Match);

    constructor(map?: GameMap, match?: Match) {
        super();

        this.numVotes = 0;
        this.map = map ?? new GameMap();
        this.match = match ?? new Match();
        if (map) {
            this.players = [];
        }
    }

    updateVote(player: Player): string {
        const length = this.players.length;
        this.players = this.players.filter((voter: Player) => voter.uuid !== player.uuid);

        // if this player previously voted for a map, they were in the this.players and have just been
        // filtered out, so its length will be lesser, decrement the vote count, else increment it
        if (this.players.length < length) {
            --this.map.numClicked;
            --this.numVotes;
            return `You revoked your vote for ${this.map.name}`;
        }

        ++this.map.numClicked;
        ++this.numVotes;
        this.players.push(player);

        this.map.save().then();
        return `You voted for ${this.map.name}`;
    }
}