import {createQueue} from "../../../src/abstract_commands/queues/create";
import {Guild} from "../../../src/entities/Guild";
import {Queue} from "../../../src/entities/queues/Queue";
import {ensure} from "../../../src/utils/general";

beforeAll(async () => {
    const guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
});

describe("Valid Create", () => {
    afterEach(async () => {
        await Queue.remove(await Queue.find());
    });

    test("Create Queue", async () => {
        const name = "queue-1", numPlayers = 4, channelId = "channel-id-1";
        expect(
            await createQueue(name, numPlayers, "guild-1", channelId),
        ).toBe(`Queue "${name}" has been created successfully!`);

        const queue = ensure(await Queue.findOneBy({name}));
        expect(queue.name).toBe(name);
        expect(queue.numPlayers).toBe(numPlayers);
        expect(queue.channelId).toBe(channelId);
    });
});