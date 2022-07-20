import { getPlayerEmbed } from '../abstract_commands/common';
import { createQueue } from '../abstract_commands/queues/create';
import { joinQueue } from '../abstract_commands/queues/join';
import { TestDataSource } from '../data-source';
import { Guild } from '../entities/Guild';
import { Queue } from '../entities/queues/Queue';
import { ensure } from '../utils/general';

beforeAll(async () => {
    await TestDataSource.initialize();
    }   
)


afterEach(async () => {
    await Queue.clear();
    await Guild.clear();
  });
   

//  There is no queue in the server
test('no queue in the server', async () => {
        let result = await joinQueue("12345678","12345678","123456789");
        expect(result).toBe(`There are no queues in this channel. Ask an admin to create one using /create_q!`);
});


//  There is a queue in the channel
test('join an existing queue', async () => {
        await createQueue("join1",2,"12345678","12345678");
        let queue = await Queue.findOneBy({name:"join1"});
        let uuid = queue?.uuid;
        let result = await joinQueue("12345678","12345678","12345678",uuid);
        let queueAfterJoin = await Queue.findOneBy({name:"join1"});
        expect(result).toStrictEqual(getPlayerEmbed(ensure(queueAfterJoin)));
});


// queue with certain id does not exist in the channel
test('join a not existing queue', async () => {
        let result = await joinQueue("12345678","12345678","12345678",1000);
        expect(result).toBe("Queue with ID 1000 does not exist in this channel");
});


// Uuid is not given by the user and there is one/multiple queues (default queue is not set)
// 1 queue
test('one queue without default queue being set', async () => {
        await createQueue("join2",2,"12345678","12345678");
        let result = await joinQueue("12345678","12345678","12345678");
        let queue = await Queue.findOneBy({name:"join2"});
        expect(result).toStrictEqual(getPlayerEmbed(ensure(queue)))
});


// Uuid is not given by the user and there is one/multiple queues (default queue is not set)
// multiple queues
test('multiple queues without default queue being set', async () => {
        await createQueue("join3",2,"12345678","12345678");
        await createQueue("join4",2,"12345678","12345678");
        let result = await joinQueue("12345678","12345678","12345678");
        expect(result).toBe("There are multiple queues in this channel, please specify the ID of the queue that you wish to join.")
});