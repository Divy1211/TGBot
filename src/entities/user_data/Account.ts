import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";

export enum AccountType {
    XBOX,
    STEAM,
}

@Entity()
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    id!: string;

    @Column()
    type: AccountType;

    @ManyToOne(() => User, (user: User) => user.profiles)
    user?: User;

    constructor();
    constructor(id: string, type: AccountType);

    constructor(id?: string, type: AccountType = AccountType.STEAM) {
        super();

        this.id = id ?? "";
        this.type = type;
    }
}