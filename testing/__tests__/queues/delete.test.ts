import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";
import {deleteQueue} from "../../../src/abstract_commands/queues/delete"
import { ensure } from "../../../src/utils/general";
import { Match } from "../../../src/entities/matches/Match";
import { PlayerStats } from "../../../src/entities/queues/PlayerStats";
import { User } from "../../../src/entities/User";
import { PoolMap } from "../../../src/entities/pools/PoolMap";
import { Pool } from "../../../src/entities/pools/Pool";
import { GameMap } from "../../../src/entities/pools/GameMap";



let guild: Guild;
let queue: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Invalid Delete", () => {

    beforeEach(async () => {
        queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    afterEach(async () => {
        await Queue.remove(await Queue.find());
        await Pool.remove(await Pool.find());
    });

    // invalid uuid
    test("Invalid UUID",async () => {
        expect(
            await deleteQueue(10000000,"channel-1"),
        ).toBe(`Error: Queue with ID \`10000000\` was not found in this channel.`)
    })

    // uuid of queue in another channel (pass another channel to the delete function)
    test("Queue In Another Channel",async () => {
        const queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
        await queue2.save();
        expect(
            await deleteQueue(queue2.uuid, "channel-1")
        ).toBe(`Error: Queue with ID \`${queue2.uuid}\` was not found in this channel.`)
    })

    // delete queue while match ongoing (create a match in the queue)
    test("Queue With Ongoing Match",async () => {
        const match = new Match();
        match.queue = queue;
        await match.save();
        expect(
            await deleteQueue(queue.uuid, "channel-1")
        ).toBe(`Error: Cannot delete queue when a match is being played in the queue.`)
    })

});

describe("Valid Delete", () => {

    beforeEach(async () => {
        queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    afterEach(async () => {
        await Queue.remove(await Queue.find());
    });

    // correct uuid
    test("Valid UUID",async () => {
        expect(
            await deleteQueue(queue.uuid,"channel-1")
        ).toBe(`Queue "${queue.name}" with ID \`${queue.uuid}\` has been deleted successfully!`)
        expect(
            await Queue.findOneBy({name:"queue-1"})
        ).toBeNull();
    })
});