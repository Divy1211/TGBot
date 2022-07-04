import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {choices} from "../../utils/general";
import {Guild} from "../Guild";
import {Pool} from "../pools/Pool";
import {PoolMap} from "../pools/PoolMap";
import {Leaderboard} from "../queues/Leaderboard";
import {PlayerStats} from "../queues/PlayerStats";
import {MapOption} from "./MapOption";
import {Player} from "./Player";

@Entity()
export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    lobbyId: number;

    @Column({type: "datetime"})
    startTime: number;

    // end time = -1 if ongoing game
    @Column({type: "datetime"})
    endTime: number;

    @Column()
    winningTeam: number;

    @Column()
    numVotesReroll: number;

    @ManyToOne(() => PoolMap, {eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    map?: PoolMap;

    @OneToMany(() => Player, (player: Player) => player.match, {cascade: true})
    players?: Player[];

    @OneToMany(() => MapOption, (mapOption: MapOption) => mapOption.match, {cascade: true})
    mapOptions?: MapOption[];

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.matches, {onDelete: "CASCADE"})
    leaderboard?: Leaderboard;

    @ManyToOne(() => Guild)
    @JoinColumn()
    guild?: Guild;

    constructor();
    constructor(playerStats: PlayerStats[], pool: Pool);

    constructor(playerStats?: PlayerStats[], pool?: Pool) {
        super();

        this.lobbyId = -1;
        this.startTime = +Date.now();
        this.endTime = -1;
        this.winningTeam = -1;
        this.numVotesReroll = 0;

        if (!playerStats || !pool)
            return;

        this.guild = pool.guild;
        this.leaderboard = playerStats[0].leaderboard;

        this.players = [];

        // ToDo: use trueskill for team
        for (let i = 0; i < playerStats.length; ++i) {
            const team = i < playerStats.length / 2 ? 1 : 2;
            const captain = i % (playerStats.length / 2) === 0;
            this.players.push(new Player(playerStats[i], this, team, captain));
        }

        let mapsMultiplied: PoolMap[] = [];
        for (const map of pool.maps)
            mapsMultiplied.push(...Array(map.multiplier).fill(map));

        this.mapOptions = [];
        for (const option of choices(mapsMultiplied, 5))
            this.mapOptions.push(new MapOption(option, this));
    }
}