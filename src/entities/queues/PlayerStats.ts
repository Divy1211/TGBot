import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Match} from "../matches/Match";
import {User} from "../User";

import {Leaderboard} from "./Leaderboard";

interface OptionalArgs {
    numGames?: number;
    numLosses?: number;
    numWins?: number;
    rating?: number;
    sigma?: number;
    streak?: number;
}

@Entity()
export class PlayerStats extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    numGames: number;

    @Column()
    numLosses: number;

    @Column()
    numWins: number;

    @Column()
    rating: number;

    @Column()
    sigma: number;

    @Column()
    streak: number;

    @ManyToOne(() => User, {eager: true, onDelete: "CASCADE"})
    @JoinColumn()
    user: User;

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.playerStats, {onDelete: "CASCADE"})
    leaderboard?: Leaderboard;

    @ManyToOne(() => Match, {onDelete: "CASCADE"})
    @JoinColumn()
    lastMatch?: Match;

    constructor();
    constructor(user: User, leaderboard: Leaderboard);
    constructor(user: User, leaderboard: Leaderboard, {numGames, numLosses, numWins, rating, sigma, streak}: OptionalArgs);

    constructor(
        user?: User, leaderboard?: Leaderboard,
        {numGames, numLosses, numWins, rating, sigma, streak}: OptionalArgs = {},
    ) {
        super();

        this.user = user ?? new User();
        this.leaderboard = leaderboard;
        this.numGames = numGames ?? 0;
        this.numLosses = numLosses ?? 0;
        this.numWins = numWins ?? 0;
        this.rating = rating ?? 1000;
        this.sigma = sigma ?? 200;
        this.streak = streak ?? 0;
    }
}