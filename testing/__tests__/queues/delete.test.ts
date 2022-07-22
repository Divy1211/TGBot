import {deleteQueue} from "../../../src/abstract_commands/queues/delete";
import {Guild} from "../../../src/entities/Guild";
import {Match} from "../../../src/entities/matches/Match";
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

describe("Invalid Delete", () => {

    // invalid uuid
    test("Invalid UUID", async () => {
        const uuid = 10000000;
        expect(
            await deleteQueue(uuid, "channel-1"),
        ).toBe(`Error: Queue with ID \`${uuid}\` was not found in this channel.`);

        expect(
            await Queue.findOneBy({uuid: queue.uuid})
        ).toBeInstanceOf(Queue);
    });

    // uuid of queue in another channel
    test("Foreign UUID", async () => {
        expect(
            await deleteQueue(queue.uuid, "channel-2"),
        ).toBe(`Error: Queue with ID \`${queue.uuid}\` was not found in this channel.`);

        expect(
            await Queue.findOneBy({uuid: queue.uuid})
        ).toBeInstanceOf(Queue);
    });

    // delete queue while match ongoing
    test("Queue With Ongoing Match", async () => {
        const match = new Match();
        match.queue = queue;
        await match.save();

        try {
            expect(
                await deleteQueue(queue.uuid, "channel-1"),
            ).toBe(`Error: Cannot delete queue when a match is being played in the queue.`);

            expect(
                await Queue.findOneBy({uuid: queue.uuid}),
            ).toBeInstanceOf(Queue);
        } finally {
            await match.remove();
        }
    });

});

describe("Valid Delete", () => {

    // correct uuid
    test("Valid UUID", async () => {
        expect(
            await deleteQueue(queue.uuid, "channel-1"),
        ).toBe(`Queue "${queue.name}" with ID \`${queue.uuid}\` has been deleted successfully!`);
        expect(
            await Queue.findOneBy({uuid: queue.uuid}),
        ).toBeNull();
    });
});