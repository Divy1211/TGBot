import {Guild} from "../../../src/entities/Guild";
import {User} from "../../../src/entities/User";
import {Ban} from "../../../src/entities/user_data/Ban";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();

    const user = new User("discord-id-1");
    await user.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await User.remove(await User.find());
});

describe("Not Already Banned", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: missing minutes (hh)
    // todo: missing minutes with seconds (hh::ss)
});

describe("Valid Duration", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo no duration (perm ban)
    // todo: hh:mm
    // todo: h:mm:ss
});