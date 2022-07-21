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
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeEach(async () => {
        queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    afterEach(async () => {
        await Queue.remove(await Queue.find());
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

    // // todo: delete queue while match ongoing (create a match in the queue)
    // test("Queue With Ongoing Match",async () => {
    //     const queue = ensure(await Queue.findOne({
    //         where: {name: "queue-1"},
    //         relations: {
    //             leaderboard: true,
    //             pools: {poolMaps: true},
    //             guild: true,
    //         },
    //     }));
    //     const pool = new Pool("pool1",guild);
    //     queue.pools = [pool]
    //     await queue.save();

    //     const user = new User("user1");
    //     const playerStats = new PlayerStats(user,new Leaderboard(guild));
    //     const match = new Match([playerStats],queue);
    //     await match.save();
    //     console.log(await Match.find());
    //     const matches = await Match.findBy({
    //         endTime: -1,
    //         queue: {uuid: queue.uuid}
    //     });
    //     expect(
    //         await deleteQueue(queue.uuid, "channel-1")
    //     ).toBe(`Error: Cannot delete queue when a match is being played in the queue.`)
    // })

});

describe("Valid Delete", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeEach(async () => {
        queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    afterEach(async () => {
        await Queue.remove(await Queue.find());
    });

    // todo: correct uuid
    test("Valid UUID",async () => {
        expect(
            await deleteQueue(queue.uuid,"channel-1")
        ).toBe(`Queue "${queue.name}" with ID \`${queue.uuid}\` has been deleted successfully!`)
        expect(
            await Queue.findOneBy({name:"queue-1"})
        ).toBeNull();
    })
});