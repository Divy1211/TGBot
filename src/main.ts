import Djs, {Intents} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import WOKC from "wokcommands";
import {AppDataSource} from "./data-source";

import {User} from "./entities/User";

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

async function main() {

    await AppDataSource.initialize();

    // testing code
    // const acc = new SteamAccount("uwu");
    // await AppDataSource.manager.save(acc);

    // const user = new User("test", [acc]);
    // await AppDataSource.manager.save(user);
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);
    console.log(users[0].steamAccounts);
    // testing code

    const commandDir = path.join(__dirname, "commands");
    const testServers = [process.env.TEST!];

    await unregisterRenamedCommands(commandDir, testServers);

    new WOKC(client, {
        commandDir,
        typeScript: true,
        testServers,
    });
}

main();
// client.on("ready", main);
// client.login(process.env.TOKEN);
