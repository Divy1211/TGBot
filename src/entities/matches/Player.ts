import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Civ} from "../../interfaces/Civ";
import {PlayerStats} from "../queues/PlayerStats";
import {User} from "../User";
import {Match} from "./Match";

@Entity()
export class Player extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    civ: Civ;

    @Column()
    colour: number;

    @Column()
    team: number;

    @Column()
    isCaptain: boolean;

    @Column()
    isReady: boolean;

    @Column()
    votedReroll: boolean;

    // this is the elo BEFORE the result of this.match is taken into account
    @Column()
    rating: number;

    @Column()
    ratingDelta: number;

    @ManyToOne(() => User, {onDelete: "SET NULL"})
    @JoinColumn()
    user?: User;

    @ManyToOne(() => Match, (match: Match) => match.players, {onDelete: "CASCADE"})
    @JoinColumn()
    match?: Match;

    constructor();
    constructor(playerStats: PlayerStats, match: Match, team: number, isCaptain: boolean);

    constructor(playerStats?: PlayerStats, match?: Match, team?: number, isCaptain?: boolean) {
        super();

        this.user = playerStats?.user;
        this.match = match;

        this.team = team ?? -1;
        this.isCaptain = isCaptain ?? false;
        this.civ = -1;
        this.colour = -1;
        this.rating = playerStats?.rating ?? -1;
        this.ratingDelta = 0;
        this.isReady = false;
        this.votedReroll = false;
    }
}