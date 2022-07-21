import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {editQueue} from "../../../src/abstract_commands/queues/edit"
import { User } from "../../../src/entities/User";

let queue1: Queue;
let queue2: Queue;
let guild: Guild;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
    await Queue.remove(await Queue.find());
});


describe("Invalid Edit", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation
    beforeEach(async () => {
        queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-id-1");
        queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-id-2");
        await Queue.save([queue1, queue2]);
    })
    
    afterEach(async () => {
        await User.remove(await User.find());
        await Queue.remove(await Queue.find());
    });

    // invalid uuid
    test("Edit invalid uuid", async () => {

        expect(
            await editQueue(1000000, "edited queue", 8, "channel-id-1"),
        ).toBe("The queue id 1000000 was not found in this channel");
    })

    // uuid of queue in another channel
    test("Edit uuid of queue in another channel", async () => {
        const uuid = queue1.uuid;
        expect(
            await editQueue(uuid, "edited queue", 8, "channel-id-2"),
        ).toBe(`The queue id ${uuid} was not found in this channel`);
    })
});

describe("Valid Edit", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: rmb, don't only check for what *should* be modified, but also check
    // todo: for stuff that should *remain* the same while editing

    beforeEach(async () => {
        queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-id-1");
        queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-id-2");
        await Queue.save([queue1, queue2]);
    })
    
    afterEach(async () => {
        await User.remove(await User.find());
        await Queue.remove(await Queue.find());
    });

    // no parameters
    test("no parameters", async () => {
        expect(
            await editQueue(queue1.uuid, "", 0, "channel-id-1"),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue1.reload();
        expect(queue1.name).toBe("queue-1");
        expect(queue1.numPlayers).toBe(4);
    })

    // todo: only name
    test("edit name", async () => {
        expect(
            await editQueue(queue1.uuid, "edit queue-1", 0, "channel-id-1"),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue1.reload();
        expect(queue1.name).toBe("edit queue-1");
        expect(queue1.numPlayers).toBe(4);
    })

    // todo: only numPlayers
    test("edit numPlayers", async () => {
        expect(
            await editQueue(queue1.uuid, "queue-1", 8, "channel-id-1"),
        ).toBe(`Queue "queue-1" has been edited successfully!`);
        await queue1.reload();
        expect(queue1.name).toBe("queue-1");
        expect(queue1.numPlayers).toBe(8);
    })

    // todo: both name and numPlayers
    test("edit both name and numPlayers", async () => {
        expect(
            await editQueue(queue1.uuid, "edit queue-1", 6, "channel-id-1"),
        ).toBe(`Queue "edit queue-1" has been edited successfully!`);
        await queue1.reload();
        expect(queue1.name).toBe("edit queue-1");
        expect(queue1.numPlayers).toBe(6);
    })
});