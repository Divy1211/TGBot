import {BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";
import {Queue} from "./Queue";

type OptionalArgs = {defaultQ?: Queue, lastQ?: Queue};

@Entity()
export class QueueDefaults extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    @OneToOne(() => Queue, {onDelete: "SET NULL"})
    @JoinColumn()
    defaultQ?: Queue;

    @OneToOne(() => Queue, {onDelete: "SET NULL"})
    @JoinColumn()
    lastQ?: Queue;

    constructor();
    constructor(user: User);
    constructor(user: User, {defaultQ, lastQ}: OptionalArgs);

    constructor(user?: User, {defaultQ, lastQ}: OptionalArgs = {}) {
        super();

        this.user = user;
        this.defaultQ = defaultQ;
        this.lastQ = lastQ;
    }
}
