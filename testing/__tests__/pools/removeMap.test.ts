import { Guild } from "../../../src/entities/Guild";
import { Pool } from "../../../src/entities/pools/Pool";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { PoolMap } from "../../../src/entities/pools/PoolMap";
import { removeMap } from "../../../src/abstract_commands/pools/remove_map";


let guild: Guild;
let map: GameMap;
let poolMap: PoolMap;
let pool: Pool;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async ()=> {
    await Guild.remove(await Guild.find());
})

describe("Valid Remove", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
        await GameMap.remove(await GameMap.find());
        await PoolMap.remove(await PoolMap.find());
    })

    test("Remove a map from a pool", async () => {
        const poolName = "poolTest", mapName = "mapTest", guildId =  "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        pool = new Pool(poolName, guild);
        map = new GameMap(mapName, imgLink, guild);
        poolMap = new PoolMap(map, pool, 4);
        await pool.save();
        await map.save();
        await poolMap.save();

        expect(
            await removeMap(map.uuid, pool.uuid, guildId)
        ).toBe(`Map ${map.name} removed from pool with ID ${pool.uuid}.`);

        expect(
            await PoolMap.findOneBy({map: {name: mapName}})
        ).toBeNull();
    })

    test("Remove a map from all pools", async () => {
        const poolName1 = "poolTest1", poolName2 = "poolTest2", mapName = "mapTest", guildId =  "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        let pool1 = new Pool(poolName1, guild);
        let pool2 = new Pool(poolName2, guild);
        map = new GameMap(mapName, imgLink, guild);
        let poolMap1 = new PoolMap(map, pool1, 4);
        let poolMap2 = new PoolMap(map, pool2, 3);
        await pool1.save();
        await pool2.save();
        await map.save();
        await poolMap1.save();
        await poolMap2.save();

        expect(
            await removeMap(map.uuid, 0, guildId)
        ).toBe(`Map ${map.name} removed from all pools.`);

        await removeMap(map.uuid, 0, guildId);
        expect(
            await PoolMap.findOneBy({map: {name: mapName}})
        ).toBeNull();
    })
})

describe("Invalid Remove", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
        await GameMap.remove(await GameMap.find());
        await PoolMap.remove(await PoolMap.find());
    })

    test("Remove a non-existing map (in the pool) from a pool", async () => {
        const poolName = "poolTest", mapName = "mapTest", guildId =  "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        pool = new Pool(poolName, guild);
        map = new GameMap(mapName, imgLink, guild);
        await pool.save();
        await map.save();

        expect(
            await removeMap(map.uuid, pool.uuid, guildId)
        ).toBe(`Map with ID ${map.uuid} was not found in pool with ID ${pool.uuid}`);
    })

    test("Remove a non-existing map (in the sever) from a pool", async () => {
        const poolName = "poolTest", guildId =  "guild-1";
        pool = new Pool(poolName, guild);
        await pool.save();

        expect(
            await removeMap(1, pool.uuid, guildId)
        ).toBe(`Map with ID 1 was not found`);
    })

    test("Remove a map from a non-existing pool", async () => {
        const mapName = "mapTest", guildId =  "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        map = new GameMap(mapName, imgLink, guild);
        await map.save();

        expect(
            await removeMap(map.uuid, 1, guildId)
        ).toBe(`Map with ID ${map.uuid} was not found in pool with ID 1`);
    })
})