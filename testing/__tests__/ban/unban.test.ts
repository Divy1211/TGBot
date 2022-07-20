import {banUser} from "../../../src/abstract_commands/ban/ban";
import {Guild} from "../../../src/entities/Guild";
import {User} from "../../../src/entities/User";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await User.remove(await User.find());
});

describe("Not Already Banned", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: not already banned
});

describe("Already Banned", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeEach(async () => {
        await banUser("discord-id-1", "", "", "guild-id-1");
    });

    // todo: already banned
});