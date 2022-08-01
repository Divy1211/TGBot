import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../User";

@Entity()
export class AoE2Link extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column({type: String, nullable: true})
    steamId?: string | null;

    @Column({type: String, nullable: true})
    profileId?: string | null; // aoe2.net profile ID

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    user?: User;

    constructor();
    constructor(user: User, {steamId, profileId}: {steamId?: string, profileId?: string});

    constructor(user?: User, {steamId, profileId}: {steamId?: string, profileId?: string} = {}) {
        super();

        this.steamId = steamId ?? null;
        this.profileId = profileId ?? null;
    }
}