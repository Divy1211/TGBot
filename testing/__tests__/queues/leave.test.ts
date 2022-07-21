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
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

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
        expect(queue1.users).toStrictEqual([]);
    });

    // todo: leave w/ queue uuid
});

describe("Valid Leave Multiple Queues", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    const uuid = 2;
    beforeEach(async () => {
        queue2.users = [user];
        await queue2.save();
    });

    // todo: leave w/o queue uuid but user is in only one queue
    // todo: leave w/ queue uuid
});

describe("Invalid Leave Single Queue", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeAll(async () => {
        queue1.users = [user];
        await queue1.save();
    });

    // todo: leave when no queues in channel
    // todo: leave invalid queue uuid
    // todo: leave when not in in queue
    // todo: leave uuid of queue in another channel
});

describe("Invalid Leave Multiple Queue", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeAll(async () => {
        queue2.users = [user];
        queue3.users = [user];
        await Queue.save([queue2, queue3]);
    });

    // todo: leave when in multiple queues w/o uuid
});