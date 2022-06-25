import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class GameMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    name: string;

    @Column()
    imgLink: string;

    constructor();
    constructor(name: string);
    constructor(name: string, imgLink: string);

    constructor(name?: string, imgLink?: string) {
        super();
        this.name = name ?? "";
        this.imgLink = imgLink ?? "";
    }
}