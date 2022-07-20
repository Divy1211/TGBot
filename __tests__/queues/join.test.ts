import {MessageEmbed} from "discord.js";
import {joinQueue} from "../../src/abstract_commands/queues/join";
import {Guild} from "../../src/entities/Guild";
import {Leaderboard} from "../../src/entities/queues/Leaderboard";
import {Queue} from "../../src/entities/queues/Queue";
import {ensure} from "../../src/utils/general";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    const queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    const queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    await Promise.all([queue1.save(), queue2.save()]);
});

afterAll(async () => {
    await Queue.clear();
});

describe("allowJoin", async () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => await Queue.clear());

    // join when there is just one single queue w/o queue uuid
    it("should put the user in the queue of the correct channel", async () => {
        expect(
            await joinQueue("discord-id-1", "channel-1", "guild-1")
        ).toBeInstanceOf(MessageEmbed);

        const queue = ensure(await Queue.findOneBy({name: "queue-1"}));
        expect(queue.users[0].discordId).toBe("discord-id-1");
    });

    // todo: join when there is just one single queue w/ queue uuid
    // todo: join when there are multiple queues w/o queue uuid but user has a queue default
    // todo: join when there are multiple queues w/ queue uuid
    // todo: join with bypass ban
});

describe("rejectJoin", async () => {
    // !! Once done with writing the test cases, just remove the "todo: "
    // DO NOT remove the full comment, as it its still useful for documentation

    afterEach(async () => await Queue.clear());

    // todo: join no queues
    // todo: join when ingame
    // todo: join when already in queue
    // todo: join when banned
    // todo: join invalid queue uuid or queue uuid of another channel
    // todo: join when multiple queues but no uuid and no queue default for user
});