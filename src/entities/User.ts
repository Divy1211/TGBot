import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Profile} from "./Profile";
import {Account} from "./Account";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    discordId: string;

    @OneToMany(() => Account, (steamAccount) => steamAccount.user, {cascade: true, eager: true})
    steamAccounts!: Account[];

    @OneToMany(() => Profile, (steamAccount) => steamAccount.user, {cascade: true, eager: true})
    profiles!: Profile[];

    constructor(discordId: string, steamAccounts?: Account[], profiles?: Account[]) {
        this.discordId = discordId;

        if (steamAccounts && steamAccounts.length > 0)
            this.steamAccounts = steamAccounts;

        if (profiles && profiles.length > 0)
            this.profiles = profiles;
    }

    public static allRelations = {
        steamAccounts: true,
        profiles: true,
    };
}