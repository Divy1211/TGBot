import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";
import {Queue} from "./Queue";

interface OptionalArgs {
    defaultQ?: Queue;
    lastQ?: Queue;
}

@Entity()
export class QueueDefaults extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    channelId: string;

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    @OneToOne(() => Queue, {cascade: true, onDelete: "SET NULL"})
    @JoinColumn()
    defaultQ?: Queue;

    @OneToOne(() => Queue, {cascade: true, onDelete: "SET NULL"})
    @JoinColumn()
    lastQ?: Queue;

    constructor();
    constructor(user: User);
    constructor(user: User, channelId: string, {defaultQ, lastQ}: OptionalArgs);

    constructor(user?: User, channelId?: string, {defaultQ, lastQ}: OptionalArgs = {}) {
        super();

        this.user = user;
        this.channelId = channelId ?? "";
        this.defaultQ = defaultQ;
        this.lastQ = lastQ;
    }
}
