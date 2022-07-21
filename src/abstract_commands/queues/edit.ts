import {Queue} from "../../entities/queues/Queue";


export async function editQueue(uuid: number, channelId: string): Promise<string>;
export async function editQueue(uuid: number, channelId: string, name: string | null): Promise<string>;
export async function editQueue(uuid: number, channelId: string, numPlayers: number | null): Promise<string>;
export async function editQueue(
    uuid: number, channelId: string, name: string | null, numPlayers: number | null,
): Promise<string>;
/**
 * Edit an existing queue by changing its name and numPlayers
 *
 * @param uuid
 * @param channelId The ID of the channel in which the queue should be edited
 * @param name
 * @param numPlayers The max number of players for the queue
 */
export async function editQueue(
    uuid: number,
    channelId: string,
    name?: string | number | null,
    numPlayers?: number | null,
): Promise<string> {

    if (typeof name === "number") {
        numPlayers = name;
        name = null;
    }

    let queue = await Queue.findOneBy({uuid, channelId});
    if (!queue) {
        return `The queue id ${uuid} was not found in this channel`;
    }
    if (name) {
        queue.name = name;
    }
    if (numPlayers) {
        queue.numPlayers = numPlayers;
    }
    if (name || numPlayers) {
        await queue.save();
    }

    return `Queue "${queue.name}" has been edited successfully!`;
}