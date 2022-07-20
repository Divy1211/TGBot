import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();

    const queue = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-id-1");
    await queue.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Invalid Edit", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: invalid uuid
    // todo: uuid of queue in another channel
});

describe("Valid Edit", () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    // todo: rmb, don't only check for what *should* be modified, but also check
    // todo: for stuff that should *remain* the same while editing

    // todo: no parameters
    // todo: only name
    // todo: only numPlayers
    // todo: both name and numPlayers
});