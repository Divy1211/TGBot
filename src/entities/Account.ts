import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

export enum AccountType {
    XBOX,
    STEAM,
}

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    id: string;

    @Column()
    type: AccountType;

    @ManyToOne(() => User, (user) => user.steamAccounts)
    user!: User;

    constructor(id: string, type: AccountType = AccountType.STEAM, user?: User) {
        this.id = id;
        this.type = type;
        if(user)
            this.user = user;
    }

    public static allRelations = {
        user: true,
    };
}