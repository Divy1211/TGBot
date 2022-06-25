import {BaseEntity, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";

import {Guild} from "./Guild";
import {Queue} from "./queues/Queue";
import {QueueDefaults} from "./queues/QueueDefaults";
import {QueueMsg} from "./queues/QueueMsg";
import {PlayerStats} from "./stats/PlayerStats";
import {Account} from "./user_data/Account";
import {Profile} from "./user_data/Profile";

interface OptionalArgs {
    guilds?: Guild[];
    accounts?: Account[];
    profiles?: Profile[];
}

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    discordId!: string;

    @ManyToMany(() => Guild, (guild: Guild) => guild.users, {cascade: true})
    guilds?: Guild[];

    @OneToMany(() => Account, (account: Account) => account.user, {cascade: true})
    accounts?: Account[];

    @OneToMany(() => Profile, (profile: Profile) => profile.user, {cascade: true})
    profiles?: Profile[];

    @ManyToMany(() => Queue, (queue: Queue) => queue.users)
    queues?: Queue[];

    constructor();
    constructor(discordId: string);
    constructor(discordId: string, {guilds, accounts, profiles}: OptionalArgs);

    constructor(discordId?: string, {guilds, accounts, profiles}: OptionalArgs = {}) {
        super();

        this.discordId = discordId ?? "";
        this.guilds = guilds;
        this.accounts = accounts;
        this.profiles = profiles;
    }
}