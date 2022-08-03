import {MessageEmbed} from "discord.js";

import {leaveQueue} from "../../../src/abstract_commands/queues/leave";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {User} from "../../../src/entities/User";

let guild: Guild;
let user: User;
let queue1: Queue;
let queue2: Queue;
let queue3: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    user = new User("discord-id-1", {guilds: [guild]});
    await user.save();

    queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    queue3 = new Queue("queue-3", guild, new Leaderboard(guild), 4, "channel-2");
    await Queue.save([queue1, queue2, queue3]);
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await User.remove(await User.find());
});

describe("Valid Leave Single Queue", () => {
    beforeEach(async () => {
        queue1.users = [user];
        await queue1.save();
    });

    // leave w/o queue uuid
    test("No UUID", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);
        await queue1.reload();
        expect(queue1.users.length).toBe(0);
    });

    // leave w/ queue uuid
    test("With UUID", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-1", "guild-1", queue1.uuid),
        ).toBeInstanceOf(MessageEmbed);
        await queue1.reload();
        expect(queue1.users.length).toBe(0);
    });
});

describe("Valid Leave Multiple Queues", () => {
    beforeEach(async () => {
        queue2.users = [user];
        await queue2.save();
    });

    // leave w/o queue uuid but user is in only one queue
    test("No UUID", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-2", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);
        await queue2.reload();

        expect(queue2.users.length).toBe(0);
    });

    //leave w/ queue uuid
    test("With UUID", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-2", "guild-1", queue2.uuid),
        ).toBeInstanceOf(MessageEmbed);
        await queue2.reload();

        expect(queue2.users.length).toBe(0);
    });
});

describe("Invalid Leave Single Queue", () => {
    beforeAll(async () => {
        queue1.users = [user];
        await queue1.save();
    });

    // leave when no queues in channel
    test("No Queues", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-2", "guild-1"),
        ).toBe("You are not in any queues");
    });

    // leave invalid queue uuid
    test("Invalid UUID", async () => {
        const uuid = 5;
        expect(
            await leaveQueue("discord-id-1", "channel-1", "guild-1", uuid),
        ).toBe(`Error: Queue with ID ${uuid} does not exist in this channel`);
    });

    // leave when not in queue
    test("Not In Queue ", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-2", "guild-1", queue2.uuid),
        ).toBe("You are not in any queues");
    });

    // leave uuid of queue in another channel
    test("Foreign UUID ", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-1", "guild-1", queue2.uuid),
        ).toBe(`Error: Queue with ID ${queue2.uuid} does not exist in this channel`);
    });
});

describe("Invalid Leave Multiple Queues", () => {
    beforeEach(async () => {
        queue2.users = [user];
        queue3.users = [user];
        await Queue.save([queue2, queue3]);
    });

    // leave when in multiple queues w/o uuid
    test("No UUID ", async () => {
        expect(
            await leaveQueue("discord-id-1", "channel-2", "guild-1"),
        ).toBe("You are in multiple queues, please specify which queue you wish to leave");
    });
});