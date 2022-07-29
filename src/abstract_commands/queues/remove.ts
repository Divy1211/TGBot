import { Queue } from "../../entities/queues/Queue";


/**
 * Remove all users from all queues
 */
export async function removeAll(): Promise<string> {
    const queues = await Queue.find();
    for (const queue of queues){
        queue.users = [];
        await queue.save();
    }
    return "All users have been removed from all queues";
}