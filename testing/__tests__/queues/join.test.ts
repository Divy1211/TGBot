import {MessageEmbed} from "discord.js";

import {joinQueue} from "../../../src/abstract_commands/queues/join";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {User} from "../../../src/entities/User";

let queue1: Queue;
let queue2: Queue;

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();

    queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    const queue3 = new Queue("queue-3", guild, new Leaderboard(guild), 4, "channel-2");
    await Queue.save([queue1, queue2, queue3]);
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Valid Join Single Queue", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await User.remove(await User.find());
    });

    test("No UUID", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue1.reload();
        expect(queue1.users[0].discordId).toBe("discord-id-1");
    });

    test("With UUID", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-2", "guild-1", queue2.uuid),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe("discord-id-1");
    });

    // todo: join with bypass ban
});

describe("Valid Join Multiple Queues", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => {
        await User.remove(await User.find());
    });

    // todo: join w/o queue uuid but user has a queue default
    // todo: join w/ queue uuid
});

describe("Invalid Join Singe Queue", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: join no queues
    // todo: join when ingame
    // todo: join when banned
    // todo: join invalid queue uuid
    // todo: join with uuid of queue in another channel
    // todo: join when already in queue
});

describe("Invalid Join Multiple Queues", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: join when multiple queues but no uuid and no queue default for user
});