import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

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

    @ManyToOne(() => User, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    @ManyToOne(() => Guild, (guild: Guild) => guild.bans, {onDelete: "CASCADE"})
    guild?: Guild;

    constructor();
    constructor(user: User, reason: string, until: number, guild: Guild);

    constructor(user?: User, reason?: string, until?: number, guild?: Guild) {
        super();

        this.user = user ?? new User();
        this.reason = reason ?? "";
        this.until = until ?? -1;
        this.guild = guild ?? new Guild();
    }

    get str() {
        super.toString();

        let parts = [];

        if(this.reason) {
            parts.push(`for "${this.reason}"`);
        }

        if(this.until !== -1) {
            parts.push(`until <t:${this.until}> which is <t:${this.until}:R>`);
        } else {
            parts = ["permanently", ...parts];
        }

        return parts.join(" ");
    }
}