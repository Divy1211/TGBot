import {banUser} from "../../../src/abstract_commands/ban/ban";
import {Guild} from "../../../src/entities/Guild";
import {User} from "../../../src/entities/User";
import {Ban} from "../../../src/entities/user_data/Ban";

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
        expect(await banUser(
            "discord-id-1", "22", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing minutes with seconds (hh::ss)
    test("Missing Minutes With Seconds", async () => {
        expect(await banUser(
            "discord-id-1", "22::44", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // missing seconds even though a second : was typed (hh:mm:)
    test("Missing Seconds", async () => {
        expect(await banUser(
            "discord-id-1", "22:33:", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // non digit character
    test("Non Digit Char", async () => {
        expect(await banUser(
            "discord-id-1", "22h:44m", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in mm
    test("One Digit Minutes", async () => {
        expect(await banUser(
            "discord-id-1", "22:4", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // only one digit in ss
    test("One Digit Seconds", async () => {
        expect(await banUser(
            "discord-id-1", "22:44:3", "", "guild-1",
        )).toBe("Error: The format of the specified duration is invalid, please try again");
    });

    // mm > 59
    test("Minutes > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:70", "", "guild-1",
        )).toBe("Error: Minutes cannot be greater than 59");
    });

    // ss > 59
    test("Seconds > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:44:70", "", "guild-1",
        )).toBe("Error: Seconds cannot be greater than 59");
    });

    // mm > 59 && ss > 59
    test("Minutes & Seconds > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:70:70", "", "guild-1",
        )).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });
});

describe("Valid Duration", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // no duration (perm ban)
    test("No Duration", async () => {
        expect(await banUser(
            "discord-id-1", "22:50", "", "guild-1",
        )).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });

    // hh:mm
    test("Minutes & Seconds > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:70:70", "", "guild-1",
        )).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });

    // h:mm:ss
    test("Minutes & Seconds > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:70:70", "", "guild-1",
        )).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });
});

describe("Reasons", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // reason given
    test("Minutes & Seconds > 59", async () => {
        expect(await banUser(
            "discord-id-1", "22:70:70", "", "guild-1",
        )).toBe("Error: Minutes & Seconds cannot be greater than 59");
    });

    // todo: reason not given
});

describe("Re-Banning", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeAll(async () => {
        const ban = new Ban(user, "", -1, guild);
        await ban.save();
    });

    // todo: ban when already banned
});