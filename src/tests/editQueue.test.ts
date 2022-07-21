import { createQueue } from '../abstract_commands/queues/create';
import { editQueue } from '../abstract_commands/queues/edit';
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


//  uuid points to an existing queue
test('should edit the queue', async () => {
            await createQueue("edit1",2,"12345678","12345678");
            let queue = await Queue.findOneBy({name:"edit1"});
            let uuid = queue!.uuid;
            let result = await editQueue(uuid,"edit edit1",2,"12345678");
            expect(result).toBe(`Queue "edit edit1" has been edited successfully!`);
            let editedQueue = await Queue.findOneBy({name:"edit edit1"});
            expect(editedQueue).not.toBeNull();
        });

//  uuid does not point to an existing queue
test('should fail to edit the queue', async () => {
            await createQueue("edit2",2,"12345678","12345678");
            let result = await editQueue(1000,"edit edit2",2,"12345678");
            expect(result).toBe(`The queue id 1000 was not found in this channel`);
});