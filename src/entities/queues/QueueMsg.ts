import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";
import {Queue} from "./Queue";

@Entity()
export class QueueMsg extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    msg: string;

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    @OneToOne(() => Queue, {onDelete: "CASCADE"})
    @JoinColumn()
    queue?: Queue;

    constructor();
    constructor(user: User, queue: Queue, msg: string);

    constructor(user?: User, queue?: Queue, msg?: string) {
        super();

        this.user = user;
        this.queue = queue;
        this.msg = msg ?? "";
    }
}
