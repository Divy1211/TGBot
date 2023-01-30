import {MessageEmbed} from "discord.js";
import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {Guild} from "../Guild";
import {Queue} from "../queues/Queue";
import {PoolMap} from "./PoolMap";

@Entity()
export class Pool extends BaseEntity {
    @PrimaryGeneratedColumn()
        uuid!: number;

    @Column()
        name: string;

    @ManyToOne(() => Guild, (guild: Guild) => guild.pools, {cascade: true, onDelete: "CASCADE"})
        guild?: Guild;

    @ManyToMany(() => Queue, (queue: Queue) => queue.pools)
        queues?: Queue[];

    @OneToMany(() => PoolMap, (poolMap: PoolMap) => poolMap.pool, {cascade: true, eager: true})
        poolMaps!: PoolMap[];

    constructor ();
    constructor (name: string, guild: Guild);

    constructor (name?: string, guild?: Guild) {
        super();

        this.name = name ?? "";
        this.guild = guild;
    }

    getMapEmbeds (showMapIds: boolean = false): MessageEmbed[] {
        if (this.poolMaps.length === 0) {
            return [
                new MessageEmbed()
                    .setTitle(this.name)
                    .setColor("#ED2939")
                    .setDescription("No maps in pool"),
            ];
        }

        const embeds: MessageEmbed[] = [];
        let embed = new MessageEmbed();
        for (let i = 0; i < this.poolMaps.length; i += 10) {
            const poolMaps = this.poolMaps.slice(i, i + 10);
            if (i % 10 === 0) {
                embed = new MessageEmbed()
                    .setTitle(this.name)
                    .setColor("#ED2939");
                embeds.push(embed);
            }
            if (showMapIds) {
                embed.addFields([
                    {
                        name: "ID",
                        value: poolMaps.map((poolMap: PoolMap) => `${poolMap.map.uuid}`).join("\n"),
                        inline: true,
                    },
                ]);
            }

            embed.addFields([
                {
                    name: "Name",
                    value: poolMaps.map((poolMap: PoolMap) => poolMap.map.hyperlinkedName).join("\n"),
                    inline: true,
                },
                {
                    name: "Multiplier",
                    value: poolMaps.map((poolMap: PoolMap) => `${poolMap.multiplier}`).join("\n"),
                    inline: true,
                },
            ]);
        }
        return embeds;
    }
}
