import {Guild} from "../../../src/entities/Guild";
import {User} from "../../../src/entities/User";
import {Ban} from "../../../src/entities/user_data/Ban";

let guild: Guild;
let user: User;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();

    user = new User("discord-id-1");
    await user.save();
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
        const ban = new Ban(user, "", -1, guild);
        await ban.save();
    });

    // todo: already banned
});