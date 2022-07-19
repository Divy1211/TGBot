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
test('should let the user join the queue', async () => {
        let result = await joinQueue("12345678","12345678","123456789",1);
        let guild = await Guild.findOneBy({id:"123456789"});
        console.log(guild);
        expect(result).toBe(`There are no queues in this channel. Ask an admin to create one using /create_q!`);
});


//  There is a queue in the channel
test('should create a new queue', async () => {
        await createQueue("join1",2,"12345678","12345678");
        let queue = await Queue.findOneBy({name:"join1"});
        let uuid = queue?.uuid;
        let result = await joinQueue("12345678","12345678","12345678",uuid);
        expect(result).toBe(getPlayerEmbed(ensure(queue)));
});