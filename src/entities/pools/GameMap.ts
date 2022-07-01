import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";

@Entity()
export class GameMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    name: string;

    @Column()
    imgLink: string;

    @Column()
    numTotal: number;

    @Column()
    numClicked: number;

    @Column()
    numShown: number;

    @Column()
    numChosen: number;

    @ManyToOne(() => Guild, (guild: Guild) => guild.maps, {onDelete: "CASCADE"})
    guild?: Guild;

    constructor();
    constructor(name: string);
    constructor(name: string, imgLink: string, guild: Guild);

    constructor(name?: string, imgLink?: string, guild?: Guild) {
        super();
        this.name = name ?? "";
        this.imgLink = imgLink ?? "";

        this.numTotal = 0;
        this.numClicked = 0;
        this.numShown = 0;
        this.numChosen = 0;

        this.guild = guild;
    }
}