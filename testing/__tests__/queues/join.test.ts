import {MessageEmbed} from "discord.js";

import {joinQueue} from "../../../src/abstract_commands/queues/join";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {QueueDefault} from "../../../src/entities/queues/QueueDefault";
import {User} from "../../../src/entities/User";
import {Ban} from "../../../src/entities/user_data/Ban";

let guild: Guild;
let queue1: Queue;
let queue2: Queue;
let queue3: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();

    queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    queue3 = new Queue("queue-3", guild, new Leaderboard(guild), 4, "channel-2");
    await Queue.save([queue1, queue2, queue3]);
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await User.remove(await User.find());
});

describe("Valid Join Single Queue", () => {
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
            await joinQueue("discord-id-1", "channel-1", "guild-1", queue1.uuid),
        ).toBeInstanceOf(MessageEmbed);

        await queue1.reload();
        expect(queue1.users[0].discordId).toBe("discord-id-1");
    });

    test("Bypass Ban", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        const ban = new Ban(user, "", -1, guild);
        await ban.save();

        expect(
            await joinQueue(discordId, "channel-1", "guild-1", true),
        ).toBeInstanceOf(MessageEmbed);

        await queue1.reload();
        expect(queue1.users[0].discordId).toBe(discordId);

        await ban.remove();
    });
});

describe("Valid Join Multiple Queues", () => {
    afterEach(async () => {
        await User.remove(await User.find());
    });

    // join w/o queue uuid but user has a queue default
    test("No UUID With Default", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);

        await queue2.reload();
        const qDefault = new QueueDefault(user, "channel-2", {defaultQ: queue2});
        await qDefault.save();

        expect(
            await joinQueue(discordId, "channel-2", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe(discordId);
    });

    // join w/o queue uuid but user has a last queue
    test("No UUID With Last", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        await queue3.reload();
        const qDefault = new QueueDefault(user, "channel-2", {lastQ: queue3});
        await qDefault.save();

        expect(
            await joinQueue(discordId, "channel-2", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue3.reload();
        expect(queue3.users[0].discordId).toBe(discordId);
    });

    test("No UUID With Default & Last", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        await queue2.reload();
        await queue3.reload();
        const qDefault = new QueueDefault(user, "channel-2", {defaultQ: queue2, lastQ: queue3});
        await qDefault.save();

        expect(
            await joinQueue(discordId, "channel-2", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe(discordId);
    });

    // join w/ queue uuid
    test("Join Multiple With UUID", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-2", "guild-1", queue2.uuid),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe("discord-id-1");
    });
});

describe("Invalid Join Singe Queue", () => {

    // join no queues
    test("No Queues 1", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-3"),
        ).toBe("There are no queues in this channel. Ask an admin to create one using /create_q!");
    });

    test("No Queues 2", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-3", "guild-1"),
        ).toBe("There are no queues in this channel. Ask an admin to create one using /create_q!");
    });

    // join when ingame
    test("In Game", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        user.inGame = true;
        await user.save();

        expect(
            await joinQueue(discordId, "channel-1", "guild-1"),
        ).toBe("You cannot join a queue while in a game");
    });

    // join when banned
    test("When Banned", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        const ban = new Ban(user, "", -1, guild);
        await ban.save();

        try {
            expect(
                await joinQueue(discordId, "channel-1", "guild-1"),
            ).toBe("You are banned from joining a queue permanently");

            await queue1.reload();
            expect(queue1.users.length).toBe(0);
        } finally {
            await ban.remove();
        }
    });

    // join invalid queue uuid
    test("Join Invalid Queue UUID", async () => {
        const uuid = 1000000;

        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1", uuid),
        ).toBe(`Queue with ID ${uuid} does not exist in this channel`);
    });

    // join with uuid of queue in another channel
    test("Join Queue UUID of Another Channel", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1", queue2.uuid),
        ).toBe(`Queue with ID ${queue2.uuid} does not exist in this channel`);
    });

    // join when already in queue
    test("The User Is In Game", async () => {
        const discordId = "discord-id-1";

        const user = new User(discordId);
        await user.save();
        queue1.users = [user];
        await queue1.save();

        expect(
            await joinQueue(discordId, "channel-1", "guild-1"),
        ).toBe("You are already in the queue!");
    });
});

describe("Invalid Join Multiple Queues", () => {

    // join when multiple queues but no uuid and no queue default for user
    test("No UUID No Default | Last", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-2", "guild-1"),
        ).toBe("There are multiple queues in this channel, please specify the ID of the queue that you wish to join.");
    });
});