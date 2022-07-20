import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();

    const queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    const queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    const queue3 = new Queue("queue-3", guild, new Leaderboard(guild), 4, "channel-2");
    await Queue.save([queue1, queue2, queue3]);
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Valid List Players", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: w/o uuid, single queue in channel (expect an instance of MessageEmbed)
    // todo: w/ uuid (expect an instance of MessageEmbed)
});

describe("Invalid List Players", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: invalid uuid
    // todo: uuid of queue in another channel
    // todo: no queues
    // todo: multiple queues w/o uuid
});