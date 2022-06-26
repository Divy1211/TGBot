import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";

@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    id!: string;

    @ManyToOne(() => User, (user: User) => user.profiles, {onDelete: "CASCADE"})
    user?: User;

    constructor();
    constructor(id: string);

    constructor(id?: string) {
        super();

        this.id = id ?? "";
    }
}