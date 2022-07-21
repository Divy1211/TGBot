import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {choose, ensure} from "../../utils/general";
import {Guild} from "../Guild";
import {GameMap} from "../pools/GameMap";
import {Pool} from "../pools/Pool";
import {Leaderboard} from "../queues/Leaderboard";
import {PlayerStats} from "../queues/PlayerStats";
import {Queue} from "../queues/Queue";
import {MapOption} from "./MapOption";
import {Player} from "./Player";

@Entity()
export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    lobbyId: number;

    @Column()
    startTime: number;

    // end time = -1 if ongoing game
    @Column()
    endTime: number;

    @Column()
    winningTeam: number;

    @Column()
    numVotesReroll: number;

    @ManyToOne(() => GameMap, {eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    map?: GameMap;

    @OneToMany(() => Player, (player: Player) => player.match, {cascade: true})
    players?: Player[];

    @OneToMany(() => MapOption, (mapOption: MapOption) => mapOption.match, {cascade: true})
    mapOptions?: MapOption[];

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.matches, {onDelete: "CASCADE"})
    leaderboard?: Leaderboard;

    @ManyToOne(() => Queue, {onDelete: "SET NULL"})
    queue?: Queue;

    @ManyToOne(() => Guild)
    @JoinColumn()
    guild?: Guild;

    constructor();
    constructor(playerStats: PlayerStats[], queue: Queue);

    constructor(playerStats?: PlayerStats[], queue?: Queue) {
        super();

        this.lobbyId = -1;
        this.startTime = Math.floor(Date.now() / 1000);
        this.endTime = -1;
        this.winningTeam = -1;
        this.numVotesReroll = 0;

        if (!playerStats || !queue) {
            return;
        }

        this.guild = ensure(queue.guild);
        this.queue = queue;
        this.leaderboard = playerStats[0].leaderboard;

        this.assignTeams(playerStats);
        this.regenMapOptions();
    }

    get unreadyPlayers(): string[] {
        return ensure(this.players)
            .filter((player: Player) => !player.isReady)
            .map((player: Player) => ensure(player.user).discordId);
    }

    private team(team: number): Player[] {
        // return array sorted in descending order by rating
        return ensure(this.players).filter((player: Player) => player.team === team)
            .sort((p1: Player, p2: Player) => p1.rating > p2.rating ? -1 : 1);
    }

    get team1(): Player[] {
        return this.team(1);
    }

    get team2(): Player[] {
        return this.team(2);
    }

    assignTeams(playerStats: PlayerStats[]): void {
        this.players = [];

        // ToDo: use trueskill for team
        for (let i = 0; i < playerStats.length; ++i) {
            const team = i < playerStats.length / 2 ? 1 : 2;
            const captain = i % (playerStats.length / 2) === 0;
            this.players.push(new Player(playerStats[i], this, team, captain));
        }
    }

    regenMapOptions(): void {
        const pools: Pool[] = Array(5).fill(ensure(this.queue?.pools)).flat();
        pools.length = 5;

        MapOption.find({
            where: {
                match: {uuid: this.uuid},
            },
        }).then(async (mapOptions: MapOption[]) => {
            for (const mapOption of mapOptions) {
                await mapOption.remove();
            }
        });

        this.mapOptions = [];

        for (const pool of pools) {
            let mapsMultiplied: GameMap[] = [];
            for (const poolMap of pool.poolMaps) {
                mapsMultiplied.push(...Array(poolMap.multiplier).fill(poolMap.map));
            }

            const mapUuids = this.mapOptions.map(option => option.map.uuid);

            let map;
            do {
                map = choose(mapsMultiplied);
            } while (mapUuids.includes(map.uuid) && pool.poolMaps.length > 5);
            // if the length is < 5, a repeat is guaranteed

            this.mapOptions.push(new MapOption(map, this));
        }
    }

    determineMap(): void {
        // find the map with the highest number of votes. If there is a tie, choose randomly
        this.map = ensure(this.mapOptions).reduce((max: MapOption, mapOption: MapOption) => {
            if (max.numVotes < mapOption.numVotes) {
                return mapOption;
            } else if (max.numVotes === mapOption.numVotes) {
                return Math.random() < 0.5 ? max : mapOption;
            }
            return max;
        }, ensure(this.mapOptions)[0]).map;
    }

    async setReady(userId: string): Promise<Player> {
        const player = ensure(this.players).filter((player: Player) => userId === ensure(player.user).discordId)[0];
        if (!player.isReady) {
            player.isReady = true;
            await player.save();
        }
        return player;
    }

    async unreadyAll(): Promise<void> {
        for (const player of ensure(this.players)) {
            player.isReady = false;
            player.votedReroll = false;
            await player.save();
        }
    }

    voteReroll(player: Player): string {
        if (player.votedReroll) {
            player.votedReroll = false;
            --this.numVotesReroll;
            return "You revoked your vote for a re-roll";
        }
        player.votedReroll = true;
        ++this.numVotesReroll;
        return "You voted for a re-roll";
    }

    getMapOptionByName(name: string): MapOption {
        return ensure(this.mapOptions).filter((mapOption: MapOption) => mapOption.map.name === name)[0];
    }
}