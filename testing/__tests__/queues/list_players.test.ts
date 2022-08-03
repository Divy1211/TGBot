import {MessageEmbed} from "discord.js";
import {listPlayers} from "../../../src/abstract_commands/queues/list_players";
import {Guild} from "../../../src/entities/Guild";
import {Leaderboard} from "../../../src/entities/queues/Leaderboard";
import {Queue} from "../../../src/entities/queues/Queue";

let guild: Guild;
let queue1: Queue;
let queue2: Queue;
let queue3: Queue;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();

    queue1 = new Queue("queue-1", guild, new Leaderboard(guild), 4, "channel-1");
    queue2 = new Queue("queue-2", guild, new Leaderboard(guild), 4, "channel-2");
    queue3 = new Queue("queue-3", guild, new Leaderboard(guild), 4, "channel-2");
    await Queue.save([queue1, queue2, queue3]);
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Valid List Players", () => {

    // w/o uuid, single queue in channel
    test("Without UUID Single Queue", async () => {
        expect(
            await listPlayers("channel-1"),
        ).toBeInstanceOf(MessageEmbed);
    });

    test("With UUID Multiple Queues", async () => {
        expect(
            await listPlayers("channel-2", queue2.uuid),
        ).toBeInstanceOf(MessageEmbed);
    });
});

describe("Invalid List Players", () => {

    // invalid uuid
    test("Invalid UUID", async () => {
        const uuid = 1000;
        expect(
            await listPlayers("channel-1", uuid),
        ).toBe(`Error: Queue with ID ${uuid} does not exist in this channel`);
    });

    // uuid of queue in another channel
    test("Foreign UUID", async () => {
        expect(
            await listPlayers("channel-1", queue2.uuid),
        ).toBe(`Error: Queue with ID ${queue2.uuid} does not exist in this channel`);
    });

    // no queues
    test("No Queues", async () => {
        expect(
            await listPlayers("channel-3"),
        ).toBe(`There are no queues in this channel. Ask an admin to create one using /create_q!`);
    });

    // multiple queues w/o uuid
    test("Without UUID Multiple Queues", async () => {
        expect(
            await listPlayers("channel-2"),
        ).toBe(`There are multiple queues in this channel, please specify which queue to show the players for.`);
    });
});