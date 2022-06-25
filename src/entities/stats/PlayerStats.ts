import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Leaderboard} from "../queues/Leaderboard";
import {User} from "../User";

interface OptionalArgs {
    numGames?: number;
    numLosses?: number;
    numWins?: number;
    rating?: number;
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
    streak: number;

    @OneToOne(() => User)
    @JoinColumn()
    user?: User;

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.playerStats)
    leaderboard?: Leaderboard;

    constructor();
    constructor(user: User, leaderboard: Leaderboard);
    constructor(user: User, leaderboard: Leaderboard, {numGames, numLosses, numWins, rating, streak}: OptionalArgs);

    constructor(
        user?: User, leaderboard?: Leaderboard, {numGames, numLosses, numWins, rating, streak}: OptionalArgs = {},
    ) {
        super();

        this.user = user;
        this.leaderboard = leaderboard;
        this.numGames = numGames ?? 0;
        this.numLosses = numLosses ?? 0;
        this.numWins = numWins ?? 0;
        this.rating = rating ?? 1000;
        this.streak = streak ?? 0;
    }
}