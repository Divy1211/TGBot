import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn} from "typeorm";

import {Guild} from "./Guild";
import {Match} from "./matches/Match";
import {Queue} from "./queues/Queue";


@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    discordId!: string;

    @Column()
    inGame: boolean;

    @ManyToMany(() => Guild, (guild: Guild) => guild.users, {cascade: true})
    guilds?: Guild[];

    @ManyToMany(() => Queue, (queue: Queue) => queue.users)
    queues?: Queue[];

    @ManyToOne(() => Match, {onDelete: "SET NULL"})
    @JoinColumn()
    currentMatch?: Match;

    constructor();
    constructor(discordId: string);
    constructor(discordId: string, {guilds}: {guilds?: Guild[]});

    constructor(discordId?: string, {guilds}: {guilds?: Guild[]} = {}) {
        super();

        this.discordId = discordId ?? "";
        this.guilds = guilds;
        this.inGame = false;
    }
}