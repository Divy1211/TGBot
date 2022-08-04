import { Guild } from "../../../src/entities/Guild";
import { Pool } from "../../../src/entities/pools/Pool";
import { deletePool } from "../../../src/abstract_commands/pools/delete_pool";


let guild: Guild;
let pool: Pool;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async ()=> {
    await Guild.remove(await Guild.find());
})

describe("Valid Delete", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    })

    test("Delete a pool from the database", async () => {
        const poolName = "poolTest", guildId =  "guild-1";
        pool = new Pool(poolName, guild);
        await pool.save();

        expect(
            await deletePool(pool.uuid, guildId)
        ).toBe(`Pool "${pool.name}" with ID ${pool.uuid} has been deleted successfully!`);

        expect(
            await Pool.findOneBy({name: poolName})
        ).toBeNull();
    })
})

describe("Invalid Delete", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    })

    test("Delete a non-existing pool", async () => {
        const guildId =  "guild-1";
        expect(
            await deletePool(1, guildId)
        ).toBe(`Pool with ID 1 does not exist in this server`);
    })
})