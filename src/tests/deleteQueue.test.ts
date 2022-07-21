import { createQueue } from '../abstract_commands/queues/create';
import { deleteQueue } from '../abstract_commands/queues/delete';
import { TestDataSource } from '../data-source';
import { Guild } from '../entities/Guild';
import { Queue } from '../entities/queues/Queue';

beforeAll(async () => {
    await TestDataSource.initialize();
    }   
)

afterAll(async () => {
  await TestDataSource.destroy();
  }   
)

afterEach(async () => {
    await Queue.clear();
    await Guild.clear();
  });


//  uuid points to existing queue
test('should delete a queue', async () => {
            await createQueue("delete1",2,"12345678","12345678");
            let queue = await Queue.findOneBy({name:"delete1"});
            let uuid = queue?.uuid;
            let result = await deleteQueue(uuid!, "12345678");
            expect(result).toBe(`Queue "delete1" with ID \`${uuid}\` has been deleted successfully!`);
            let findQueue = await Queue.findOneBy({name:"delete1"});
            expect(findQueue).toBeNull();
        });


//  uuid does not point to an existing queue
test('should fail to delete a queue', async () => {
            let result = await deleteQueue(100, "12345678");
            expect(result).toBe(`Queue with ID \`100\` was not found in this channel`);
});


// channel id does not point to an existing channel
test('should fail to delete a queue', async () => {
            await createQueue("delete2",2,"12345678","12345678");
            let queue = await Queue.findOneBy({name:"delete2"});
            let uuid = queue?.uuid;
            let result = await deleteQueue(uuid!, "1234567890");
            expect(result).toBe(`Queue with ID \`${uuid}\` was not found in this channel`);
});

