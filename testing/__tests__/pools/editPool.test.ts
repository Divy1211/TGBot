import {Guild} from "../../../src/entities/Guild";
import {Pool} from "../../../src/entities/pools/Pool";
import {editPool} from "../../../src/abstract_commands/pools/edit_pool"
import {ensure} from "../../../src/utils/general";


let guild: Guild;
let pool: Pool;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async ()=> {
    await Guild.remove(await Guild.find());
})

describe("Valid Edit", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    })

    test("Edit a pool in the server", async () => {
        const poolName = "poolTest", guildId =  "guild-1";
        const editName = "editName";
        pool = new Pool(poolName, guild);
        await pool.save();

        expect(
            await editPool(guildId, pool.uuid, editName)
        ).toBe(`Pool "${editName}" has been edited successfully!`);

        const editedPool = ensure(await Pool.findOneBy({guild: {id: guildId}}));
        expect(editedPool.name).toBe(editName);
    })
})

describe("Invalid Edit", () => {
    afterEach(async () => {
        await Pool.remove(await Pool.find());
    })

    test("Edit a non-existing pool in the server", async () => {
        const guildId = "guild-1", editName = "editName";
        expect(
            await editPool(guildId, 1, editName)
        ).toBe("Pool with ID 1 does not exist in this server");
    })
})