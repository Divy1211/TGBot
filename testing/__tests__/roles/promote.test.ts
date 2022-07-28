import {promote} from "../../../src/abstract_commands/roles/promote";
import {Guild} from "../../../src/entities/Guild";

let guild: Guild;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Invalid Promo", () => {
    test("No Role", async () => {
        expect(
            await promote("guild-1"),
        ).toBe(`No promotion role set.`);
    });

    test("Too Frequent Promo", async () => {
        guild.promotionRoleId = "promo-role-id";
        guild.lastPromotion = Math.floor(Date.now()/1000);
        await guild.save();

        expect(
            await promote("guild-1"),
        ).toMatch(/Too little time between promotions. The next promotion can be used <t:\d+?:R>/);
    });
});

describe("Valid Promo", () => {
    beforeAll(async() => {
        guild.promotionRoleId = "promo-role-id";
        guild.lastPromotion = -1;
        await guild.save();
    })

    test("Promo", async () => {
        expect(
            await promote("guild-1"),
        ).toBe(`Come play some games! <@&promo-role-id>`);
    });
});