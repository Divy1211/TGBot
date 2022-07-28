import {setPromoCooldown} from "../../../src/abstract_commands/roles/set_promo_cd";
import {Guild} from "../../../src/entities/Guild";

let guild: Guild;

beforeAll(async () => {
    guild = new Guild("guild-1");
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Invalid Duration", () => {
    // missing minutes (hh)
    test("Missing Minutes", async () => {
        expect(
            await setPromoCooldown("guild-1", "22"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing minutes with seconds (hh::ss)
    test("Missing Minutes With Seconds", async () => {
        expect(
            await setPromoCooldown("guild-1", "22::44"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing seconds even though a second : was typed (hh:mm:)
    test("Missing Seconds", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:33:"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // non digit character
    test("Non Digit Char", async () => {
        expect(
            await setPromoCooldown("guild-1", "22h:44m"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in mm
    test("One Digit Minutes", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:4"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in ss
    test("One Digit Seconds", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:44:3"),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // mm > 59
    test("Minutes > 59", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:70"),
        ).toBe("Error: Minutes cannot be greater than 59");
    });

    // ss > 59
    test("Seconds > 59", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:44:70"),
        ).toBe("Error: Seconds cannot be greater than 59");
    });

    // mm > 59 && ss > 59
    test("Minutes & Seconds > 59", async () => {
        expect(
            await setPromoCooldown("guild-1", "22:70:70"),
        ).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });
});

describe("Valid Duration", () => {
    // hh:mm
    test("Hours Minutes", async () => {
        expect(
            await setPromoCooldown("guild-1", "01:10"),
        ).toBe(`Promotion cooldown set to: 01:10.`);

        await guild.reload();
        expect(guild.promotionCooldown).toBe(70 * 60);
    });

    // h:mm:ss
    test("Hours Minutes Seconds", async () => {
        expect(
            await setPromoCooldown("guild-1", "1:10:30"),
        ).toBe(`Promotion cooldown set to: 1:10:30.`);

        await guild.reload();
        expect(guild.promotionCooldown).toBe(70 * 60 + 30);
    });
});