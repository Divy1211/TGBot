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
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: missing minutes (hh)
    // todo: missing minutes with seconds (hh::ss)
    // todo: missing seconds even though a second : was typed (hh:mm:) (BUG!)
    // todo: non digit character
    // todo: only one digit in mm
    // todo: only one digit in ss
    // todo: mm > 59 (BUG!)
    // todo: ss > 59 (BUG!)
});

describe("Valid Duration", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // todo no duration (perm ban)
    // todo: hh:mm
    // todo: h:mm:ss
});

describe("Reasons", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await Ban.remove(await Ban.find());
    });

    // todo: reason given
    // todo: reason not given
});

describe("Re-Banning", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeAll(async () => {
        const ban = new Ban(user, "", -1, guild);
        await ban.save();
    })

    // todo: ban when already banned
});