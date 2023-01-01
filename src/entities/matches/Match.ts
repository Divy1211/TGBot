import {Message, MessageActionRow, MessageButton, MessageEmbed, TextBasedChannel} from "discord.js";
import fetch from "node-fetch";
import {quality, Rating} from "ts-trueskill";
import {BaseEntity, Column, Entity, In, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {cancelMatch} from "../../abstract_commands/matches/cancel";
import {client} from "../../main";
import {choose, combinations, ensure} from "../../utils/general";
import {Guild} from "../Guild";
import {GameMap} from "../pools/GameMap";
import {Pool} from "../pools/Pool";
import {Leaderboard} from "../queues/Leaderboard";
import {PlayerStats} from "../queues/PlayerStats";
import {Queue} from "../queues/Queue";
import {AoE2Link} from "../user_data/AoE2Link";
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
    map!: GameMap;

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
        this.leaderboard = ensure(playerStats[0].leaderboard);

        this.assignTeams(playerStats);
        this.regenMapOptions();
    }

    get status(): string {
        return this.endTime === -1 ? "Ongoing" : `Ended <t:${this.endTime}:R>`;
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

    get winningTeamPlayers(): Player[] {
        return this.team(this.winningTeam);
    }

    get losingTeamPlayers(): Player[] {
        return this.team(3-this.winningTeam);
    }

    get teamOnePlayers(): Player[] {
        return this.team(1);
    }

    get teamTwoPlayers(): Player[] {
        return this.team(2);
    }

    get duration(): string {
        let dur;
        if (this.endTime === -1) {
            dur = Math.floor(Date.now() / 1000) - this.startTime;
        } else {
            dur = this.endTime - this.startTime;
        }
        return ensure(new Date(dur * 1000).toISOString().match(/\d{2}:\d{2}:\d{2}/))[0];
    }

    getResultEmbed(showMapImg: boolean = false): MessageEmbed {
        let embed = new MessageEmbed()
            .setTitle(`Match ${this.uuid}`)
            .setDescription(`Map: ${this.map?.hyperlinkedName ?? "Undecided"}, Duration: ${this.duration}`)
            .setColor("#ED2939")
            .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/5/55/AoE_Definitive_Edition.png")
            .addFields(
                {
                    name: `Team 1`,
                    value: `${this.teamOnePlayers.map(({user, rating, ratingDelta}) => {
                        if (this.endTime !== -1) {
                            return `<@${ensure(user).discordId}> \`${rating} => ` +
                                   `${rating + ratingDelta} (${ratingDelta < 0 ? "" : "+"}${ratingDelta})\``;
                        }
                        return `<@${ensure(user).discordId}> \`${rating}\``;
                    }).join("\n")}`,
                    inline: true,
                },
                {
                    name: `Team 2`,
                    value: `${this.teamTwoPlayers.map(({user, rating, ratingDelta}) => {
                        if (this.endTime !== -1) {
                            return `<@${ensure(user).discordId}> \`${rating} => ` +
                                   `${rating + ratingDelta} (${ratingDelta < 0 ? "" : "+"}${ratingDelta})\``;
                        }
                        return `<@${ensure(user).discordId}> \`${rating}\``;
                    }).join("\n")}`,
                    inline: true,
                },
            );

        if (showMapImg && this.map?.imgLink) {
            embed.setImage(this.map.imgLink);
        }

        return embed;
    }

    assignTeams(playerStats: PlayerStats[]): void {
        this.players = [];

        const possibleTeams: PlayerStats[][] = combinations(playerStats, Math.floor(playerStats.length/2));
        let bestTeams: PlayerStats[][] = [];
        let highestQuality = -1;

        for(let i = 0; i < possibleTeams.length/2; ++i) {
            const team1 = possibleTeams[i];
            const team2 = possibleTeams.slice(-i-1)[0];

            const ratingsTeam1 = team1.map((stats: PlayerStats) => new Rating(stats.rating, stats.sigma + 5 * Math.abs(stats.streak)));
            const ratingsTeam2 = team2.map((stats: PlayerStats) => new Rating(stats.rating, stats.sigma + 5 * Math.abs(stats.streak)));

            let q = quality([ratingsTeam1, ratingsTeam2]);
            if(q > highestQuality) {
                highestQuality = q;
                bestTeams = [team1, team2];
            }
        }

        const [team1, team2] = bestTeams;

        team1.sort((a: PlayerStats, b: PlayerStats) => a.rating > b.rating ? -1 : 1);
        team2.sort((a: PlayerStats, b: PlayerStats) => a.rating > b.rating ? -1 : 1);

        for(const [i, stats] of team1.entries()) {
            this.players.push(new Player(stats, this, 1, i === 0));
        }

        for(const [i, stats] of team2.entries()) {
            this.players.push(new Player(stats, this, 2, i === 0));
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
            // only re-choose if the length is > 5, otherwise a repeat is guaranteed
            ++map.numShown;
            map.numTotal += ensure(this.queue).numPlayers;
            map.save().then();

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

        ++this.map.numChosen;
        this.map.save().then();
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
        return ensure(this.mapOptions).filter((mapOption: MapOption) => name.startsWith(mapOption.map.name))[0];
    }

    get embed(): MessageEmbed {

        return new MessageEmbed()
            .setTitle(`Match ${this.uuid}`)
            .setColor("#ED2939")
            .addFields(
                {
                    name: `Team 1`,
                    value: `${this.teamOnePlayers.map(
                        (player: Player) => `<@${ensure(player.user).discordId}> (${player.rating})`)
                        .join("\n")}`,
                    inline: true,
                },
                {
                    name: `Team 2`,
                    value: `${this.teamTwoPlayers.map(
                        (player: Player) => `<@${ensure(player.user).discordId}> (${player.rating})`)
                        .join("\n")}`,
                    inline: true,
                },
                {
                    name: `Map`,
                    value: `${ensure(this.map).name}`,
                },
            )
            .setImage(ensure(this.map).imgLink)
            .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/5/55/AoE_Definitive_Edition.png");
    }

    async setupVotingOptions() {
        const channel = await client.channels.fetch(ensure(this.queue).channelId);
        if (!channel?.isText()) {
            return;
        }

        let msg = await this.sendOptions(channel);

        // create a vote listener with a time limit of 5 minutes and filter events by the users in the game only.
        const playerDiscordIds = ensure(this.players).map((player: Player) => ensure(player.user).discordId);
        const votes = channel.createMessageComponentCollector({
            filter: (buttonInteraction) => playerDiscordIds.includes(buttonInteraction.user.id),
            time: 1000 * 60 * 5, // time in ms, 5 minute time out
        });

        // the actual vote listener
        votes.on("collect", async (vote) => {
            const player = await this.setReady(vote.user.id);

            // update the list of players that need to vote in the original message
            await msg.edit([
                `Match \`${this.uuid}\` started! The following players need to vote:`,
                `<@${this.unreadyPlayers.join(">\n<@")}>`,
                `If someone does not vote, this will cancel <t:${this.startTime + 5 * 60}:R>!`,
            ].join("\n"));


            if (vote.customId === "reroll") {
                try {
                    vote.reply({
                        ephemeral: true,
                        content: this.voteReroll(player),
                    }).then();
                } catch (e) {
                }

                // if the vote count for rerolls reaches a majority, actually reroll
                if (this.numVotesReroll >= ensure(this.players).length / 2) {
                    this.numVotesReroll = 0;
                    this.regenMapOptions();

                    await this.unreadyAll();

                    await msg.delete();
                    msg = await this.sendOptions(channel, false);
                }
                await this.save();

            } else if (vote.customId === "cancel") {
                try {
                    await vote.deferUpdate();
                } catch (e) {
                }

                await msg.edit({
                    content: `<@${vote.user.id}> cancelled the match, reverting to the queue stage...`,
                    components: [],
                });

                for(const matchPlayer of ensure(this.players)) {
                    matchPlayer.isReady = true;
                }
                player.isReady = false;
                await Player.save(ensure(this.players));

                votes.stop();
            } else {
                const mapOption = this.getMapOptionByName(vote.customId);
                try {
                    vote.reply({
                        ephemeral: true,
                        content: mapOption.updateVote(player),
                    }).then();
                } catch (e) {
                }

                await mapOption.save();

                if (this.unreadyPlayers.length === 0) {
                    this.determineMap();

                    await msg.delete();
                    msg = await channel.send({
                        content: null,
                        embeds: [this.embed],
                    });

                    const matchUsers = ensure(this.players).map((player: Player) => player.user);
                    const links = await AoE2Link.findBy({user: In(matchUsers)});
                    let profileIdMap: {[profileId: string]: boolean} = {};
                    for (const link of links) {
                        if (!link.profileId) {
                            continue;
                        }
                        profileIdMap[link.profileId] = true;
                    }

                    const setGameButtons = async () => {
                        let lobbies;
                        try {
                            const res = await fetch("https://aoe2.net/api/lobbies?game=aoe2de");
                            lobbies = await res.json();
                        } catch (e) {
                            // aoe2.net unavailable
                        }
                        if (!lobbies) {
                            return;
                        }

                        for (const lobby of lobbies) {
                            for (const player of lobby[`players`]) {
                                if (!profileIdMap[player[`profile_id`]]) {
                                    continue;
                                }

                                if(this.lobbyId != lobby[`match_id`]) {
                                    this.lobbyId = lobby[`match_id`];
                                    await this.save();
                                }

                                if(!lobby[`started`]) {
                                    setTimeout(setGameButtons, 5 * 1000);
                                } else if(!lobby[`finished`]) {
                                    setTimeout(setGameButtons, 60 * 1000);
                                } else {
                                    // todo: detect drop
                                }

                                await msg.edit({
                                    content: null,
                                    embeds: [this.embed],
                                    components: [
                                        new MessageActionRow().addComponents(
                                            new MessageButton()
                                                .setLabel("Join")
                                                .setURL(`https://aoe2.net/j/${lobby[`match_id`]}`)
                                                .setStyle("LINK")
                                                .setEmoji("🎮"),

                                            new MessageButton()
                                                .setLabel("Spectate")
                                                .setURL(`https://aoe2.net/s/${lobby[`match_id`]}`)
                                                .setStyle("LINK")
                                                .setEmoji("👓"),
                                        ),
                                    ],
                                });
                                return;
                            }
                        }

                        setTimeout(setGameButtons, 5 * 1000);
                        await msg.edit({
                            content: null,
                            embeds: [this.embed],
                            components: [],
                        });
                    }

                    if (links.length > 0) {
                        setGameButtons().then();
                        setTimeout(setGameButtons, 5 * 1000);
                    }

                    await this.save();
                    votes.stop();
                }
            }
        });

        // this callback is run when the 5-minute timer runs out
        votes.on("end", async () => {
            const {unreadyPlayers} = this;
            if (unreadyPlayers.length > 0) {
                await new Promise(f => setTimeout(f, 500));
                if(!msg.content.endsWith("stage...")) {
                    await msg.edit({
                        content: `<@${unreadyPlayers.join(">, <@")}> did not vote in time, aborting match...`,
                        components: [],
                    });
                }
                cancelMatch(ensure(this.guild).id, this.uuid, unreadyPlayers).then();
            }
        });
    }

    /**
     * Sends and returns a message with the map options voting button interface
     *
     * @param channel The channel to send the options in
     * @param reroll If set to false, the option to reroll won't be generated
     */
    async sendOptions(
        channel: TextBasedChannel,
        reroll: boolean = true,
    ): Promise<Message> {
        let mapRow1: MessageActionRow = new MessageActionRow();
        let linkRow1: MessageActionRow = new MessageActionRow();
        let mapRow2: MessageActionRow = new MessageActionRow();
        let linkRow2: MessageActionRow = new MessageActionRow();
        let idCounts: Record<string, number> = {};
        ensure(this.mapOptions).forEach((option: MapOption, i: number) => {
            let mapRow = i <= 2 ? mapRow1 : mapRow2;
            let linkRow = i <= 2 ? linkRow1 : linkRow2;

            option.map.name in idCounts || (idCounts[option.map.name] = 0);
            idCounts[option.map.name] += 1

            mapRow.addComponents(
                new MessageButton()
                    .setCustomId(option.map.name + idCounts[option.map.name])
                    .setLabel(`${option.map.name}\_\_\_\_`)
                    .setStyle("PRIMARY"),
            );
            linkRow.addComponents(
                new MessageButton()
                    .setLabel(option.map.name)
                    // we are not removing this default link. period.
                    .setURL(option.map.imgLink ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .setStyle("LINK"),
            );
        });

        linkRow2.addComponents(
            new MessageButton()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle("DANGER"),
        );
        if (reroll) {
            mapRow2.addComponents(
                new MessageButton()
                    .setCustomId("reroll")
                    .setLabel("Re-Roll")
                    .setStyle("SUCCESS"),
            );
        }

        return await channel.send({
            content: [
                `Match \`${this.uuid}\` started! The following players need to vote:`,
                `<@${this.unreadyPlayers.join(">\n<@")}>`,
                `If someone does not vote, this match will cancel <t:${this.startTime + 5 * 60}:R>!`,
            ].join("\n"),
            components: [mapRow1, linkRow1, mapRow2, linkRow2],
        });
    }
}