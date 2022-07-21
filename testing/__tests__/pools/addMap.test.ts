import { addMap } from "../../../src/abstract_commands/pools/add_map";
import { createMap } from "../../../src/abstract_commands/pools/create_map";
import { createPool } from "../../../src/abstract_commands/pools/create_pool";
import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { Pool } from "../../../src/entities/pools/Pool";
import { ensure } from "../../../src/utils/general";

beforeAll(async () => {
    const guild = new Guild("guild-1");
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
        
        await createMap(mapName, imgLink, guildId);
        await createPool(poolName, guildId);

        expect(
            await addMap(1, 1, 5, guildId)
            ).toBe(`Map "${mapName}" added to Pool "${poolName}"`);
    })
})

describe("Invalid Add", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
        await Pool.remove(await Pool.find());
    });

    test("Add a non-existing map to a pool", async () => {
        const poolName = "poolTest", guildId = "guild-1";
        await createPool(poolName, guildId);
        let pool = ensure(await Pool.findOneBy({name: poolName}));
        expect(
            await addMap(1, pool.uuid, 5, guildId)
            ).toBe("Map with ID `1` was not found.");
    });

    test("Add a map to a non-existing pool", async () => {
        const mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";

        await createMap(mapName, imgLink, guildId);
        let map = ensure(await GameMap.findOneBy({name: mapName}));
        expect(
            await addMap(map.uuid, 1, 5, guildId)
            ).toBe("Pool with ID `1` was not found.");
    })
})