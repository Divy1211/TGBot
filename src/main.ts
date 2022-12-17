import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import WOKC from "wokcommands";

import {AppDataSource} from "./data-source";
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

async function main() {

    await AppDataSource.initialize();
    console.log("db connected!");

    const commandDir = path.join(__dirname, "commands");
    await unregisterRenamedCommands(commandDir, []);
    new WOKC(client, {
        commandDir,
        typeScript: !!process.env.DEV ,
    });

    startLogger();
}

client.on("ready", main);
client.login(ensure(process.env.TOKEN)).then();
