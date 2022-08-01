import { GameMap } from "../../../src/entities/pools/GameMap";
import { PoolMap } from "../../../src/entities/pools/PoolMap";
import { Pool } from "../../../src/entities/pools/Pool";
import { Guild } from "../../../src/entities/Guild";
import { MessageEmbed } from "discord.js";
import {listPools} from "../../../src/abstract_commands/pools/list_pools";


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

describe("Valid List Pools", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
        await GameMap.remove(await GameMap.find());
        await PoolMap.remove(await PoolMap.find());
    })

    test("list pools of current guild", async () => {
        const poolName = "poolTest", mapName = "mapTest", guildId = "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        pool = new Pool(poolName, guild);
        map = new GameMap(mapName, imgLink, guild);
        poolMap = new PoolMap(map, pool, 4);
        await pool.save();
        await map.save();
        await poolMap.save();

        expect(
            await listPools(guildId)
        ).toBeInstanceOf(MessageEmbed);
    })
})