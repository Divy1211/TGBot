import { createPool } from "../../../src/abstract_commands/pools/create_pool";
import { Guild } from "../../../src/entities/Guild";
import { Pool } from "../../../src/entities/pools/Pool";
import { ensure } from "../../../src/utils/general";


let guild: Guild;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async () => {
    await Guild.remove(await Guild.find());
})

describe("Valid Create", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    });

    test("Create pool", async () => {
        const name = "pool-test", guildId = "guild-1"
        expect(
            await createPool(name, guildId)
            ).toBe(`Pool "${name}" has been created successfully!`);
            
        const pool = ensure(await Pool.findOne(
            {
                where: {name: name}, 
                relations: {guild: true}
            }));
        expect(pool.name).toBe(name);
        expect(pool.guild?.id).toBe("guild-1");
    })
})

describe("Invalid Create", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    });

    test("Create the pool with a replicated pool name", async () => {
        const name = "pool-test", guildId = "guild-1";

        await createPool(name, guildId);
        expect(
            await createPool(name, guildId)
            ).toBe(`Invalid: pool with name ${name} already exists in the database.`);
        
        const pools = await Pool.find(
            {where: {guild: {id: guildId}}}
        );
        
        const pool = ensure(await Pool.findOneBy({name: name}));
        expect(pools.length).toBe(1);    // only one pool is in the Pool table
        expect(pool.name).toBe(name);
    })
})