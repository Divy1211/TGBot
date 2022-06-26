import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import WOKC from "wokcommands";

import {AppDataSource} from "./data-source";
import {Guild} from "./entities/Guild";
import {GameMap} from "./entities/pools/GameMap";
import {Pool} from "./entities/pools/Pool";
import {PoolMap} from "./entities/pools/PoolMap";
import {Leaderboard} from "./entities/queues/Leaderboard";
import {Queue} from "./entities/queues/Queue";
import {User} from "./entities/User";
import {ensure} from "./utils/general";

dotenv.config();

export const client = new Djs.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

/**
 *
 * Finds the names of all the files inside a given directory and its sub directories.
 *
 * @param dir The directory to scan for files.
 *
 * @returns A list of file names inside the directory and sub directories in that directory.
 */
function recursiveReaddir(dir: string): string[] {
    let fileNames: string[] = [];
    let names = fs.readdirSync(dir);
    names.forEach((name) => {
        if (name.match(/^\w*?\.\w+$/)) // if name is a file
            fileNames.push(name);
        else
            fileNames.push(...recursiveReaddir(path.join(dir, name)));
    });
    return fileNames;
}

/**
 *
 * Checks for and deletes commands that have been renamed or deleted. Used only during development.
 * When a command is renamed in or deleted from the code files, it is not automatically removed from the bot.
 *
 * @param commandsDir The directory that contains all the command code files.
 * @param testServers The test servers to unregister the commands from
 */
async function unregisterRenamedCommands(commandsDir: string, testServers: string[]): Promise<void> {
    const commandNames = recursiveReaddir(commandsDir).map((name) => name.replace(".ts", ""));

    for (const guildId of testServers) {
        console.log(`Unregistering commands from test server: ${guildId}`);
        const guild = client.guilds.cache.get(guildId);
        let commands = await guild?.commands.fetch();

        if (!commands)
            return;

        commands.forEach((command, id) => {
            if (!commandNames.includes(command.name)) {
                console.log(`    - '${command.name}'`, "color: #ffda55");
                command.delete();
            }
        });
    }
}

async function createTestingDatabase() {
    const guild = new Guild("testId");
    const queue = new Queue("testName", guild, new Leaderboard(guild), 8, "testChannelId");
    await queue.save();

    const pool = new Pool("testQ", guild);
    pool.queues = [queue];
    pool.maps = [
        new PoolMap(new GameMap("Arabia"), pool, 2),
        new PoolMap(new GameMap("Arena"), pool, 1),
        new PoolMap(new GameMap("Hideout"), pool, 1),
        new PoolMap(new GameMap("Fortress"), pool, 1),
        new PoolMap(new GameMap("Nomad"), pool, 1),
        new PoolMap(new GameMap("BF"), pool, 1),
        new PoolMap(new GameMap("MR"), pool, 1),
    ];
    await pool.save();

    for (let i = 0; i < 16; ++i) {
        const user = new User(`testId${i}`);
        await user.save();
    }
}

async function main() {

    await AppDataSource.initialize();
    console.log("db connected!");

    // testing code start
    // await createTestingDatabase();

    // const queue = (await Queue.find({
    //     where: {
    //         channelId: "testChannelId"
    //     },
    //     relations: {
    //         leaderboard: true,
    //         pools: true
    //     }
    // }))[0];
    //
    // const users = (await User.find()).splice(0, 8);
    //
    // const statlist = [];
    //
    // for(const user of users) {
    //     let stats: PlayerStats | null;
    //
    //     stats = await PlayerStats.findOneBy({
    //         user: {
    //             discordId: user.discordId
    //         },
    //         leaderboard: {
    //             uuid: ensure(queue.leaderboard).uuid
    //         }
    //     });
    //     if(!stats) {
    //         stats = new PlayerStats(user, ensure(queue.leaderboard));
    //         console.log(`saving stats for ${user.discordId}`)
    //         await stats.save();
    //     }
    //     statlist.push(stats);
    // }

    // const match = new Match(statlist, ensure(queue.pools)[0]);

    // const match = (await Match.find({relations: {mapOptions: true}}))[0];
    // console.log(match.mapOptions?.length);
    //
    // await match.remove();

    // await match.save();

    // return;
    // testing code end

    const commandDir = path.join(__dirname, "commands");
    const testServers = [ensure(process.env.TEST)];

    await unregisterRenamedCommands(commandDir, testServers);

    new WOKC(client, {
        commandDir,
        typeScript: true,
        testServers,
    });
}

// main();
client.on("ready", main);
client.login(ensure(process.env.TOKEN)).then();
