import { getPlayerEmbed } from '../abstract_commands/common';
import { createQueue } from '../abstract_commands/queues/create';
import { joinQueue } from '../abstract_commands/queues/join';
import { leaveQueue } from '../abstract_commands/queues/leave';
import { TestDataSource } from '../data-source';
import { Guild } from '../entities/Guild';
import { Queue } from '../entities/queues/Queue';
import { User } from '../entities/User';
import { ensure } from '../utils/general';

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
    // await User.clear();
  });
   

//  user is in a queue
test('the user should leave a queue', async () => {
    await  createQueue("leave1", 2, "12345678", "12345678");
    await joinQueue("12345678", "12345678", "12345678");
    let result = await leaveQueue("12345678", "12345678", "12345678"); 
    let queue = await Queue.findOneBy({name:"leave1"});
    expect(result).toStrictEqual(getPlayerEmbed(ensure(queue)));
});


// //  guildId points to an existing guild
// test('should create a new queue', async () => {
//   await createQueue("create2",2,"12345678","12345678");
//   let result = await createQueue("create3",2,"12345678","12345678");
//   expect(result).toBe(`Queue "create3" has been created successfully!`);
//   let queue = await Queue.findOneBy({name:"create3"});
//   expect(queue).not.toBeNull();
// });