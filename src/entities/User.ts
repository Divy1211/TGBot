import {BaseEntity, Entity, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";

import {Guild} from "./Guild";
import {Queue} from "./Queue";
import {PlayerStatistics} from "./stats/PlayerStatistics";
import {Account} from "./user_data/Account";
import {Profile} from "./user_data/Profile";

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    discordId: string;

    @ManyToMany(() => Guild, (guild: Guild) => guild.users, {cascade: true})
    guilds!: Guild[];

    @OneToMany(() => Account, (account: Account) => account.user, {cascade: true})
    accounts!: Account[];

    @OneToMany(() => Profile, (profile: Profile) => profile.user, {cascade: true})
    profiles!: Profile[];

    @ManyToMany(() => Queue, (queue: Queue) => queue.users)
    queues!: Queue[];

    @OneToMany(() => PlayerStatistics, (playerStatistics: PlayerStatistics) => playerStatistics.user)
    playerStatistics!: PlayerStatistics[];

    constructor(
        discordId: string,
        {guilds, accounts, profiles}: {guilds?: Guild[], accounts?: Account[], profiles?: Profile[]} = {},
    ) {
        super();

        this.discordId = discordId;
        if (guilds && guilds.length > 0)
            this.guilds = guilds;
        if (accounts && accounts.length > 0)
            this.accounts = accounts;
        if (profiles && profiles.length > 0)
            this.profiles = profiles;
    }
}