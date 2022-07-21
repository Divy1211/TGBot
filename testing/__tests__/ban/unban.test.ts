import {unbanUser} from "../../../src/abstract_commands/ban/unban";
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

describe("Invalid Unban", () => {

    // not banned
    test("Not Already Banned", async () => {
        const discordId = "discord-id-1";

        expect(
            await unbanUser(discordId, "guild-1"),
        ).toBe(`Error: <@${discordId}> is not banned`);
    });

    // not banned in the server the command is run in
    test("Banned But Different Guild", async () => {
        const ban = new Ban(user, "", -1, guild);
        await ban.save();

        const discordId = "discord-id-1";

        expect(
            await unbanUser(discordId, "guild-2"),
        ).toBe(`Error: <@${discordId}> is not banned`);
    });
});

describe("Valid Unban", () => {
    beforeEach(async () => {
        const ban = new Ban(user, "", -1, guild);
        await ban.save();
    });

    test("Already Banned", async () => {
        const discordId = "discord-id-1";

        expect(
            await unbanUser(discordId, "guild-1"),
        ).toBe(`<@${discordId}> has been unbanned`);
    });
});