import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import WOKC from "wokcommands";

import {AppDataSource} from "./data-source";
import {Guild} from "./entities/Guild";
import {MapOption} from "./entities/matches/MapOption";
import {Match} from "./entities/matches/Match";
import {GameMap} from "./entities/pools/GameMap";
import {Pool} from "./entities/pools/Pool";
import {PoolMap} from "./entities/pools/PoolMap";
import {Leaderboard} from "./entities/queues/Leaderboard";
import {Queue} from "./entities/queues/Queue";
import {startLogger} from "./logger";
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
 * @param full_paths if true, the full relative path of the file is included instead of just filename.
 *
 * @returns A list of file names inside the directory and subdirectories in that directory.
 */
export function recursiveReaddir(dir: string, full_paths: boolean = false): string[] {
    let fileNames: string[] = [];
    let names = fs.readdirSync(dir);
    names.forEach((name) => {
        if (name.match(/^\w*?\.\w+$/)) // if name is a file
        {
            fileNames.push(full_paths ? dir + "\\" + name : name);
        } else {
            fileNames.push(...recursiveReaddir(path.join(dir, name), full_paths));
        }
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

        if (!commands) {
            return;
        }

        commands.forEach((command, id) => {
            if (!commandNames.includes(command.name)) {
                console.log(`    - '${command.name}'`, "color: #ffda55");
                command.delete();
            }
        });
    }
}

async function createTestingDatabase() {
    const guild = new Guild("979245239116136448");
    const queue = new Queue("test", guild, new Leaderboard(guild), 2, "979245239384539187");
    await queue.save();

    const pool = new Pool("test", ensure((queue).guild));
    await pool.save();

    pool.maps = [];
    for (let i = 0; i < 10; ++i) {
        const map = new GameMap(`map #${i}`, "https://static.toiimg.com/thumb/53110049.cms?width=1200&height=900", ensure(queue.guild));
        await map.save();

        const poolMap = new PoolMap(map, pool, 1);
        await poolMap.save();
    }

    queue.pools = [pool];
    await queue.save();
}

async function main() {

    await AppDataSource.initialize();
    console.log("db connected!");

    // testing code start
    // await createTestingDatabase();

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

    startLogger();
}

// main();
client.on("ready", main);
client.login(ensure(process.env.TOKEN)).then();
