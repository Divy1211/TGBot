import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";
import {Queue} from "./Queue";

interface OptionalArgs {
    defaultQ?: Queue;
    lastQ?: Queue;
}

@Entity()
export class QueueDefault extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    channelId: string;

    @ManyToOne(() => User, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    @ManyToOne(() => Queue, {cascade: true, eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    defaultQ?: Queue;

    @ManyToOne(() => Queue, {cascade: true, eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    lastQ?: Queue;

    constructor();
    constructor(user: User, channelId: string);
    constructor(user: User, channelId: string, {defaultQ, lastQ}: OptionalArgs);

    constructor(user?: User, channelId?: string, {defaultQ, lastQ}: OptionalArgs = {}) {
        super();

        this.user = user;
        this.channelId = channelId ?? "";
        this.defaultQ = defaultQ;
        this.lastQ = lastQ;
    }
}
