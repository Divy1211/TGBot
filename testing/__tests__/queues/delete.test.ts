import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

let guild: Guild;

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

    beforeAll(async () => {
        const queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    // todo: invalid uuid
    // todo: uuid of queue in another channel (pass another channel to the delete function)
    // todo: delete queue while match ongoing (create a match in the queue)
});

describe("Valid Delete", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    beforeEach(async () => {
        const queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
        await queue.save();
    });

    // todo: correct uuid
});