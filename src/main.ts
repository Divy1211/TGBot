import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import WOKC from "wokcommands";

import {AppDataSource} from "./data-source";
import {Guild} from "./entities/Guild";
import {GameMap} from "./entities/pools/GameMap";
import {Pool} from "./entities/pools/Pool";
import {PoolMap} from "./entities/pools/PoolMap";
import {Leaderboard} from "./entities/queues/Leaderboard";
import {Queue} from "./entities/queues/Queue";
import {startLogger} from "./logger";
import {ensure} from "./utils/general";
import {recursiveReaddir} from "./utils/node";

dotenv.config();

export const client = new Djs.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        // Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

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

        commands.forEach((command) => {
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

    pool.poolMaps = [];
    for (let i = 0; i < 10; ++i) {
        const map = new GameMap(
            `map #${i}`, "https://static.toiimg.com/thumb/53110049.cms?width=1200&height=900", ensure(queue.guild));
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
