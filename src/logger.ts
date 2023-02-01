import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import path from "path";
import {ICommand} from "wokcommands";

import {Guild} from "./entities/Guild";
import {client} from "./main";
import {ensure} from "./utils/general";
import {recursiveReaddir} from "./utils/node";

export function startLogger () {
    const files = recursiveReaddir(path.join(__dirname, "commands"), true);
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const {user, guildId, channelId, options} = interaction;
        if (!guildId) {
            return;
        }

        const guild = await Guild.findOneBy({id: guildId});
        if (!guild?.loggingChannelId) {
            return;
        }

        const commandFile = ensure(files.find((file: string) => file.endsWith(`${interaction.commandName}.ts`)));
        const command: ICommand = (await import(commandFile)).default;

        const channel = await client.channels.fetch(guild.loggingChannelId);

        let args = "";
        for (const option of command.options ?? []) {
            if (option.type === ApplicationCommandOptionTypes.ROLE) {
                const id = options.get(option.name)?.role?.id;
                if (id) {
                    args += ` ${option.name}: <@&${id}>`;
                }
            } else if (option.type === ApplicationCommandOptionTypes.USER) {
                const id = options.get(option.name)?.user?.id;
                if (id) {
                    args += ` ${option.name}: <@${id}>`;
                }
            } else if (option.type === ApplicationCommandOptionTypes.CHANNEL) {
                const id = options.get(option.name)?.channel?.id;
                if (id) {
                    args += ` ${option.name}: <#${id}>`;
                }
            } else {
                const val = options.get(option.name)?.value;
                if (val !== undefined) {
                    args += ` ${option.name}: ${val}`;
                }
            }
        }

        if (channel?.isText()) {
            const msg = await channel.send(`${user.username} used \`/${interaction.commandName}${args}\` in <#${channelId}>`);
            await msg.edit(`<@${user.id}> used \`/${interaction.commandName}${args}\` in <#${channelId}>`);
        }
    });
}
