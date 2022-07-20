import {setRole} from "../../../src/abstract_commands/roles/set_role";
import {Guild} from "../../../src/entities/Guild";

let guild: Guild;

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Set Role", () => {
    test("Admin", async () => {
        const roleId = "role-admin";

        expect(
            await setRole("guild-1", "admin", roleId),
        ).toBe(`Role <@<${roleId}> has been set as the admin role.`);

        await guild.reload();
        expect(guild.adminRoleId).toBe(roleId);
    });

    test("Mod", async () => {
        const roleId = "role-mod";

        expect(
            await setRole("guild-1", "mod", roleId),
        ).toBe(`Role <@<${roleId}> has been set as the mod role.`);

        await guild.reload();
        expect(guild.modRoleId).toBe(roleId);
    });

    test("Admin", async () => {
        const roleId = "role-promo";

        expect(
            await setRole("guild-1", "promotion", roleId),
        ).toBe(`Role <@<${roleId}> has been set as the promotion role.`);

        await guild.reload();
        expect(guild.promotionRoleId).toBe(roleId);
    });
});