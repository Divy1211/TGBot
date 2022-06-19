import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "../User";

@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    id: string;

    @ManyToOne(() => User, (user: User) => user.profiles)
    user!: User;

    constructor(id: string) {
        super();
        this.id = id;
    }
}