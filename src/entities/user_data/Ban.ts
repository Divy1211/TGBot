import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {User} from "../User";


@Entity()
export class Ban extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    reason: string;

    // set to -1 if permanent ban
    @Column()
    until: number;

    @OneToOne(() => User)
    @JoinColumn()
    user?: User;

    @ManyToOne(() => Guild, (guild: Guild) => guild.bans, {onDelete: "CASCADE"})
    guild?: Guild;

    constructor();
    constructor(user: User, reason: string, until: number);

    constructor(user?: User, reason?: string, until?: number) {
        super();

        this.user = user ?? new User();
        this.reason = reason ?? "";
        this.until = until ?? -1;
    }
}