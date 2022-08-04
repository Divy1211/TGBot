import {editQueue} from "../../../src/abstract_commands/queues/edit";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

let guild: Guild;
let queue: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();

    queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
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
            await editQueue(uuid, "channel-1", {name: "edited queue", numPlayers: 8}),
        ).toBe(`The queue id ${uuid} does not exist in this channel`);
    });

    // uuid of queue in another channel
    test("Foreign UUID", async () => {
        expect(
            await editQueue(queue.uuid, "channel-id-2", {name: "edited queue", numPlayers: 8}),
        ).toBe(`The queue id ${queue.uuid} does not exist in this channel`);
    });
});

describe("Valid Edit", () => {

    afterEach(async () => {
        queue.name = "queue-1";
        queue.numPlayers = 4;
        await queue.save();
    });

    // no parameters
    test("No Parameters", async () => {
        expect(
            await editQueue(queue.uuid, "channel-1"),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("queue-1");
        expect(queue.numPlayers).toBe(4);
    });

    // only numPlayers
    test("Only NumPlayers", async () => {
        expect(
            await editQueue(queue.uuid, "channel-1", {numPlayers: 8}),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("queue-1");
        expect(queue.numPlayers).toBe(8);
    });

    // only name
    test("Only Name", async () => {
        expect(
            await editQueue(queue.uuid, "channel-1", {name: "edit queue-1"}),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("edit queue-1");
        expect(queue.numPlayers).toBe(4);
    });

    // both name and numPlayers
    test("Name & NumPlayers", async () => {
        expect(
            await editQueue(queue.uuid, "channel-1", {name: "edit queue-1", numPlayers: 6}),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue.reload();
        expect(queue.name).toBe("edit queue-1");
        expect(queue.numPlayers).toBe(6);
    });
});