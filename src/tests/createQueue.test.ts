import { createQueue } from '../abstract_commands/queues/create';
import { TestDataSource } from '../data-source';
import { Guild } from '../entities/Guild';
import { Queue } from '../entities/queues/Queue';

beforeAll(async () => {
    await TestDataSource.initialize();
    }   
)


afterEach(async () => {
    await Queue.clear();
    await Guild.clear();
  });
   

//  guildId does not point to an existing guild
test('should create a new queue', async () => {
  let result = await createQueue("create1",2,"12345678","12345678");
  expect(result).toBe(`Queue "create1" has been created successfully!`);
  let queue = await Queue.findOneBy({name:"create1"});
  expect(queue).not.toBeNull();
});


//  guildId points to an existing guild
test('should create a new queue', async () => {
  await createQueue("create2",2,"12345678","12345678");
  let result = await createQueue("create3",2,"12345678","12345678");
  expect(result).toBe(`Queue "create3" has been created successfully!`);
  let queue = await Queue.findOneBy({name:"create3"});
  expect(queue).not.toBeNull();
});