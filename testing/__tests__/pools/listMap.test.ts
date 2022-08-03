import { listMaps } from "../../../src/abstract_commands/pools/list_maps";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { PoolMap } from "../../../src/entities/pools/PoolMap";
import { Pool } from "../../../src/entities/pools/Pool";
import { Guild } from "../../../src/entities/Guild";
import { MessageEmbed } from "discord.js";


let guild: Guild;
let pool: Pool;
let map: GameMap;
let poolMap: PoolMap;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async () => {
    await Guild.remove(await Guild.find());
})

describe("Valid List Map", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
        await GameMap.remove(await GameMap.find());
        await PoolMap.remove(await PoolMap.find());
    })

    test("list maps in a pool", async () => {
        const poolName = "poolTest", mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        pool = new Pool(poolName, guild);
        map = new GameMap(mapName, imgLink, guild);
        poolMap = new PoolMap(map, pool, 4);
        await pool.save();
        await map.save();
        await poolMap.save();

        expect(
            await listMaps(guildId, true, false, pool.uuid)
        ).toBeInstanceOf(MessageEmbed);
    })

    test("list maps in all pools", async () => {
        const poolName1 = "poolTest1", poolName2 = "poolTest2", mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        let pool1 = new Pool(poolName1, guild);
        let pool2 = new Pool(poolName2, guild);
        map = new GameMap(mapName, imgLink, guild);
        let poolMap1 = new PoolMap(map, pool1, 4);
        let poolMap2 = new PoolMap(map, pool2, 6);
        await pool1.save();
        await pool2.save();
        await map.save();
        await poolMap1.save();
        await poolMap2.save();

        expect(
            await listMaps(guildId, true, false)
        ).toBeInstanceOf(MessageEmbed);
    })
})

describe("Invalid List Map", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
        await GameMap.remove(await GameMap.find());
        await PoolMap.remove(await PoolMap.find());
    })

    test("list maps in a non-existing pool", async () => {
        const mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        map = new GameMap(mapName, imgLink, guild);
        await map.save();

        expect(
            await listMaps(guildId, true, false, 1)
        ).toBe(`The pool with ID 1 was not found.`)
    })
})