import {editQueue} from "../../../src/abstract_commands/queues/edit";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

let guild: Guild;
let queue: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();

    queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-id-1");
    await queue.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});


describe("Invalid Edit", () => {
    // invalid uuid
    test("Invalid UUID", async () => {
        const uuid = 1000000;
        expect(
            await editQueue(uuid, "edited queue", 8, "channel-id-1"),
        ).toBe(`The queue id ${uuid} was not found in this channel`);
    });

    // uuid of queue in another channel
    test("Foreign UUID", async () => {
        expect(
            await editQueue(queue.uuid, "edited queue", 8, "channel-id-2"),
        ).toBe(`The queue id ${queue.uuid} was not found in this channel`);
    });
});

describe("Valid Edit", () => {
    // rmb, don't only check for what *should* be modified, but also check
    // for stuff that should *remain* the same while editing

    // no parameters
    test("no parameters", async () => {
        expect(
            await editQueue(queue.uuid, "", 0, "channel-id-1"),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("queue-1");
        expect(queue.numPlayers).toBe(4);
    });

    // only name
    test("edit name", async () => {
        expect(
            await editQueue(queue.uuid, "edit queue-1", 0, "channel-id-1"),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("edit queue-1");
        expect(queue.numPlayers).toBe(4);
    });

    // only numPlayers
    test("edit numPlayers", async () => {
        expect(
            await editQueue(queue.uuid, "queue-1", 8, "channel-id-1"),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("queue-1");
        expect(queue.numPlayers).toBe(8);
    });

    // both name and numPlayers
    test("edit both name and numPlayers", async () => {
        expect(
            await editQueue(queue.uuid, "edit queue-1", 6, "channel-id-1"),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("edit queue-1");
        expect(queue.numPlayers).toBe(6);
    });
});