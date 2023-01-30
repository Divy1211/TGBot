import {MessageEmbed} from "discord.js";
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {Pool} from "../pools/Pool";
import {User} from "../User";
import {Leaderboard} from "./Leaderboard";

@Entity()
export class Queue extends BaseEntity {
    @PrimaryGeneratedColumn()
        uuid!: number;

    @Column()
        name: string;

    @Column()
        numPlayers: number;

    @Column()
        channelId: string;

    @ManyToOne(() => Guild, (guild: Guild) => guild.queues, {cascade: true, onDelete: "CASCADE"})
        guild?: Guild;

    @ManyToMany(() => Pool, (pool: Pool) => pool.queues)
    @JoinTable()
        pools?: Pool[];

    @ManyToMany(() => User, (user: User) => user.queues, {cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinTable()
        users!: User[];

    @ManyToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.queue, {cascade: true, onDelete: "CASCADE"})
        leaderboard?: Leaderboard;

    constructor ();
    constructor (name: string, guild: Guild, leaderboard: Leaderboard, numPlayers: number, channelId: string);

    constructor (name?: string, guild?: Guild, leaderboard?: Leaderboard, numPlayers?: number, channelId?: string) {
        super();

        this.name = name ?? "";
        this.guild = guild;
        this.leaderboard = leaderboard;
        this.numPlayers = numPlayers ?? -1;
        this.channelId = channelId ?? "";
    }

    /**
     * Get an embed to show the players in the given queue
     */
    getPlayerEmbed () {
        return new MessageEmbed()
            .setTitle(this.name)
            .setDescription("The following players are waiting for a game in queue:")
            .setColor("#ED2939")
            .addFields({
                name: `Players ${this.users.length}/${this.numPlayers}`,
                value: this.users.map((user, i) => {
                    return `${i + 1}. <@${user.discordId}>`;
                }).join("\n") || "No players in queue",
            });
    }
}
