import {MessageEmbed} from "discord.js";

import {joinQueue} from "../../../src/abstract_commands/queues/join";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {User} from "../../../src/entities/User";
import { ensure } from "../../../src/utils/general";
import {banUser} from "../../../src/abstract_commands/ban/ban"
import { QueueDefault } from "../../../src/entities/queues/QueueDefault";

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
    await Queue.remove(await Queue.find());
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
            await joinQueue("discord-id-1", "channel-2", "guild-1", queue2.uuid),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe("discord-id-1");
    });

    // join with bypass ban
    test("Bypass Ban", async () => {
        await banUser("discord-id-1", "00:00:00", "", "guild-1");
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);
        expect(queue1.users[0].discordId).toBe("discord-id-1");
    });
});

describe("Valid Join Multiple Queues", () => {
    afterEach(async () => {
        await User.remove(await User.find());
    });

    // join w/o queue uuid but user has a queue default
    test("Join Multiple No UUID With Default Queue", async () => {
        const queue3 = ensure(await Queue.findOneBy({name: "queue-3"}));
        const user = new User("discord-id-1");
        await user.save();
        const qDefault = new QueueDefault(user, "channel-1", {defaultQ: queue2, lastQ: queue3});
        await qDefault.save();

        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue1.reload();
        expect(queue1.users[0].discordId).toBe("discord-id-1");
    });

    // join w/ queue uuid
    test("Join Multiple With UUID", async () => {
        const uuid = queue2.uuid;
        expect(
            await joinQueue("discord-id-1", "channel-2", "guild-1", uuid),
        ).toBeInstanceOf(MessageEmbed);

        await queue2.reload();
        expect(queue2.users[0].discordId).toBe("discord-id-1");
    });
});

describe("Invalid Join Singe Queue", () => {
    afterEach(async () => {
        await User.remove(await User.find());
    });

    // join no queues
    test("Join No Queues", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-3"),
        ).toBe("There are no queues in this channel. Ask an admin to create one using /create_q!");
    });

    // join when ingame
    test("The User Is In Game", async () => {
        const user = new User("discord-id-1");
        user.inGame = true;
        await user.save();
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBe("You cannot join a queue while in a game");
    });

    // join when banned
    test("Join Single No UUID", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1"),
        ).toBeInstanceOf(MessageEmbed);

        await queue1.reload();
        expect(queue1.users[0].discordId).toBe("discord-id-1");
    });

    // join invalid queue uuid
    test("Join Invalid Queue UUID", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1", 1000000),
        ).toBe("Queue with ID 1000000 does not exist in this channel");
    });

    // join with uuid of queue in another channel
    test("Join Queue UUID of Another Channel", async () => {
        const uuid = queue2.uuid;
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1", uuid),
        ).toBe(`Queue with ID ${uuid} does not exist in this channel`);
    });

    // join when already in queue
    test("The User Is In Game", async () => {
        await joinQueue("discord-id-1", "channel-1", "guild-1"),
            expect(
                await joinQueue("discord-id-1", "channel-1", "guild-1"),
            ).toBe("You are already in the queue!");
    });
});

describe("Invalid Join Multiple Queues", () => {
    afterEach(async () => {
        await User.remove(await User.find());
    });

    // join when multiple queues but no uuid and no queue default for user
    test("Join when multiple queues but no uuid and no queue default for user", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-2", "guild-1"),
        ).toBe("There are multiple queues in this channel, please specify the ID of the queue that you wish to join.");
    });
});