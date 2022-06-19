import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    uuid!: number

    @Column()
    id: string;

    @ManyToOne(() => User, (user) => user.profiles)
    user!: User

    constructor(id: string, user?: User) {
        this.id = id;
        if(user)
            this.user = user;
    }

    public static allRelations = {
        user: true,
    };
}