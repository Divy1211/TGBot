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

    @ManyToOne(() => Guild, (guild: Guild) => guild.maps, {cascade: true, onDelete: "CASCADE"})
    guild?: Guild;

    constructor();
    constructor(name: string, guild: Guild);
    constructor(name: string, imgLink: string, guild: Guild);

    constructor(name?: string, imgLink?: Guild | string, guild?: Guild) {
        if (imgLink instanceof Guild) {
            guild = imgLink;
            imgLink = undefined;
        }

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