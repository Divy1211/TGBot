import {MessageEmbed} from "discord.js";
import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {ensure} from "../../utils/general";
import {Guild} from "../Guild";
import {PoolMap} from "./PoolMap";

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

    @OneToMany(() => PoolMap, (poolMap: PoolMap) => poolMap.map)
    poolMaps?: PoolMap[];

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

    get chooseRate(): number | string {
        if (this.numShown === 0) {
            return "-";
        }

        const rate = this.numChosen / this.numShown * 100;
        return Math.floor(rate * 100) / 100;
    }

    get clickThroughRate(): number | string {
        if (this.numTotal === 0) {
            return "-";
        }

        const rate = this.numClicked / this.numTotal * 100;
        return Math.floor(rate * 100) / 100;
    }

    get poolIds(): string {
        let poolIds: number[] = [];
        for (const poolMap of ensure(this.poolMaps)) {
            const poolId = ensure(poolMap.pool).uuid;
            if (!poolIds.includes(poolId)) {
                poolIds.push(poolId);
            }
        }
        if (poolIds.length === 0) {
            return "-";
        }
        return `${poolIds.join(",")}`;
    }

    get hyperlinkedName(): string {
        // the name is hyperlinked to the image if available, same format as markdown
        if (this.imgLink) {
            return `[${this.name}](${this.imgLink})`;
        }
        return this.name;
    }

    get embed(): MessageEmbed {
        let embed = new MessageEmbed()
            .setTitle(this.name)
            .setColor("#ED2939")
            .addFields([
                {
                    name: "Actual Votes",
                    value: `${this.numClicked}`,
                    inline: true,
                },
                {
                    name: "Possible Votes",
                    value: `${this.numTotal}`,
                    inline: true,
                },
                {
                    name: "Click Through %",
                    value: `${this.clickThroughRate}`,
                    inline: true,
                },
                {
                    name: "Times Chosen",
                    value: `${this.numChosen}`,
                    inline: true,
                },
                {
                    name: "Times Shown",
                    value: `${this.numShown}`,
                    inline: true,
                },
                {
                    name: "Choose %",
                    value: `${this.chooseRate}`,
                    inline: true,
                },
            ]);

        if (this.imgLink) {
            embed.setImage(this.imgLink);
        }
        return embed;
    }
}