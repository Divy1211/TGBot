import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {PoolMap} from "./PoolMap";

@Entity()
export class GameMap extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid!: number;

    @Column()
    name: string;

    @Column()
    imgLink: string;

    @OneToMany(() => PoolMap, (poolMap: PoolMap) => poolMap.map)
    poolMaps?: PoolMap[];

    constructor();
    constructor(name: string);
    constructor(name: string, imgLink: string);

    constructor(name?: string, imgLink?: string) {
        super();
        this.name = name ?? "";
        this.imgLink = imgLink ?? "";
    }
}