import { addMap } from "../../../src/abstract_commands/pools/add_map";
import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { Pool } from "../../../src/entities/pools/Pool";


let guild: Guild;
let map: GameMap;
let pool: Pool;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async () => {
    await Guild.remove(await Guild.find());
})

describe("Valid Add", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
        await Pool.remove(await Pool.find());
    });

    test("Add a map to a pool", async () => {
        const mapName = "mapTest", poolName = "poolTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        
        map = new GameMap(mapName, imgLink, guild);
        await map.save();
        pool = new Pool(poolName,guild);
        await pool.save();

        expect(
            await addMap(guildId, map.uuid, pool.uuid, 5)
        ).toBe(`Map "${mapName}" added to pool "${poolName}"`);
    });
})

describe("Invalid Add", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
        await Pool.remove(await Pool.find());
    });

    test("Add a non-existing map to a pool", async () => {
        const poolName = "poolTest", guildId = "guild-1";
        pool = new Pool(poolName, guild);
        await pool.save();

        expect(
            await addMap(guildId, 1, pool.uuid, 5)
        ).toBe("Map with ID `1` does not exist in this server");
    });

    test("Add a map to a non-existing pool", async () => {
        const mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";

        map = new GameMap(mapName, imgLink, guild);
        await map.save();

        expect(
            await addMap(guildId, map.uuid, 1, 5)
        ).toBe("Pool with ID `1` does not exist in this server");
    });
})