import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import WOKC from "wokcommands";

import {AppDataSource} from "./data_source";
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
    const commandNames = recursiveReaddir(commandsDir).map((name) => name.replace(/\.[tj]s/g, ""));

    if(testServers.length == 0) {
        testServers.push("global")
    }

    for (const guildId of testServers) {
        console.log(`Unregistering commands from test server: ${guildId}`);
        let guild: Djs.Guild | undefined = undefined;
        if(guildId === "global")
            guild = client.guilds.cache.get(guildId);
        let commands = await ((guild) ? guild?.commands.fetch() : client?.application?.commands.fetch());

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

    const maps = [
        new GameMap(`Acclivity`, "https://i.imgur.com/TJx1fC7.png", ensure(queue.guild)),
        new GameMap(`Acropolis`, "https://i.imgur.com/Bd8zKAR.png", ensure(queue.guild)),
        new GameMap(`African Clearing`, "https://i.imgur.com/zr0qL0X.png", ensure(queue.guild)),
        new GameMap(`Arabia`, "https://i.imgur.com/M96ubOm.png", ensure(queue.guild)),
        new GameMap(`Arena`, "https://i.imgur.com/nVdsfeT.png", ensure(queue.guild)),
        new GameMap(`Hideout`, "https://i.imgur.com/PEZBJbl.png", ensure(queue.guild)),
        new GameMap(`Ravines`, "https://i.imgur.com/jEXQA8R.png", ensure(queue.guild)),
        new GameMap(`Steppe`, "https://i.imgur.com/kYYdh0d.png", ensure(queue.guild)),
        new GameMap(`Team Islands`, "https://i.imgur.com/r6WyUc3.png", ensure(queue.guild)),
        new GameMap(`Water Nomad`, "https://i.imgur.com/AFNk7zC.png", ensure(queue.guild)),
    ]
    await GameMap.save(maps);

    for(const map of maps) {
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
    await createTestingDatabase();

    // return;
    // testing code end

    const commandDir = path.join(__dirname, "commands");
    const testServers = !!process.env.DEV ? [ensure(process.env.TEST)] : [];

    await unregisterRenamedCommands(
        commandDir,
        testServers,
    );

    new WOKC(client, {
        commandDir,
        typeScript: !!process.env.DEV,
        testServers,
    });

    startLogger();
}

// main();
client.on("ready", main);
if(!!process.env.DEV)
    client.login(ensure(process.env.TEST_TOKEN)).then();
else
    client.login(ensure(process.env.TOKEN)).then();
