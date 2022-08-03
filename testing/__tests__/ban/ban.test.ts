import {banUser} from "../../../src/abstract_commands/ban/ban";
import {Guild} from "../../../src/entities/Guild";
import {User} from "../../../src/entities/User";
import {Ban} from "../../../src/entities/user_data/Ban";
import {ensure} from "../../../src/utils/general";

let guild: Guild;
let user: User;

beforeAll(async () => {
    guild = new Guild("guild-1");
    user = new User("discord-id-1", {guilds: [guild]});
    await user.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await User.remove(await User.find());
});

describe("Invalid Duration", () => {
    // missing minutes (hh)
    test("Missing Minutes", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing minutes with seconds (hh::ss)
    test("Missing Minutes With Seconds", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22::44", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing seconds even though a second : was typed (hh:mm:)
    test("Missing Seconds", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:33:", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // non digit character
    test("Non Digit Char", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22h:44m", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in mm
    test("One Digit Minutes", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:4", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in ss
    test("One Digit Seconds", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:44:3", ""),
        ).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // mm > 59
    test("Minutes > 59", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:70", ""),
        ).toBe("Error: Minutes cannot be greater than 59");
    });

    // ss > 59
    test("Seconds > 59", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:44:70", ""),
        ).toBe("Error: Seconds cannot be greater than 59");
    });

    // mm > 59 && ss > 59
    test("Minutes & Seconds > 59", async () => {
        expect(
            await banUser("discord-id-1", "guild-1", "22:70:70", ""),
        ).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });
});

describe("Valid Duration", () => {
    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // no duration (perm ban)
    test("No Duration", async () => {
        const discordId = "discord-id-1";

        expect(await banUser(discordId, "guild-1", "", "")).toBe(`<@${discordId}> has been banned permanently`);

        const ban = ensure(await Ban.findOne({
            where: {
                user: {discordId},
                guild: {id: "guild-1"},
            },
        }));
        expect(ban.until).toBe(-1);
        expect(ban.reason).toBe("");
    });

    // hh:mm
    test("Hours Minutes", async () => {
        const discordId = "discord-id-1";

        expect(
            await banUser(discordId, "guild-1", "01:10", ""),
        ).toMatch(/<@discord-id-1> has been banned until <t:\d+?> which is <t:\d+?:R>/);

        const ban = ensure(await Ban.findOne({
            where: {
                user: {discordId},
                guild: {id: "guild-1"},
            },
        }));
        // the above function call should ban the user for 70 minutes. Since it uses Date.now() we just test
        // it to be about the same time as this:
        expect(ban.until - (70 * 60 + Math.floor(Date.now() / 1000))).toBeLessThan(5);
        expect(ban.reason).toBe("");
    });

    // h:mm:ss
    test("Hours Minutes Seconds", async () => {
        const discordId = "discord-id-1";

        expect(
            await banUser(discordId, "guild-1", "1:10:30", ""),
        ).toMatch(/<@discord-id-1> has been banned until <t:\d+?> which is <t:\d+?:R>/);

        const ban = ensure(await Ban.findOne({
            where: {
                user: {discordId},
                guild: {id: "guild-1"},
            },
        }));
        // the above function call should ban the user for 70 minutes. Since it uses Date.now() we just test
        // it to be about the same time as this:
        expect(ban.until - (70 * 60 + 30 + Math.floor(Date.now() / 1000))).toBeLessThan(5);
        expect(ban.reason).toBe("");
    });
});

describe("Reasons", () => {
    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // reason given
    test("Reason Provided", async () => {
        const discordId = "discord-id-1";
        const reason = "test";

        expect(
            await banUser(discordId, "guild-1", "", reason),
        ).toBe(`<@${discordId}> has been banned permanently for "${reason}"`);

        const ban = ensure(await Ban.findOne({
            where: {
                user: {discordId},
                guild: {id: "guild-1"},
            },
        }));
        expect(ban.until).toBe(-1);
        expect(ban.reason).toBe(reason);
    });

    // reason not given - none of the other test cases give reasons
});

describe("Re-Banning", () => {
    beforeAll(async () => {
        const ban = new Ban(user, "", -1, guild);
        await ban.save();
    });

    test("Already Banned", async () => {
        const discordId = "discord-id-1";

        expect(
            await banUser(discordId, "guild-1", "", ""),
        ).toBe(`Error: <@${discordId}> is already banned permanently`);
    });
});