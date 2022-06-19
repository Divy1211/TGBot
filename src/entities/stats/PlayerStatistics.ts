import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Leaderboard} from "../Leaderboard";
import {User} from "../User";

@Entity()
export class PlayerStatistics extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @ManyToOne(() => User, (user: User) => user.playerStatistics)
    user: User;

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.playerStatistics)
    leaderboard: Leaderboard;

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

    constructor(
        user: User, leaderboard: Leaderboard, numGames: number = 0, numLosses: number = 0, numWins: number = 0,
        rating: number = 1000, streak: number = 0,
    ) {
        super();
        this.user = user;
        this.leaderboard = leaderboard;
        this.numGames = numGames;
        this.numLosses = numLosses;
        this.numWins = numWins;
        this.rating = rating;
        this.streak = streak;
    }
}