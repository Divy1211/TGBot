import {GuildMember} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {isAdmin} from "../../abstract_commands/permissions";
import {deletePool} from "../../abstract_commands/pools/delete_pool";
import {Guild} from "../../entities/Guild";
import {ensure} from "../../utils/general";


export default {
    category: "Admin",
    description: "Delete a pool from the server",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "pool_uuids",
            description: "Comma separated list of uuids of the pool to remove",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, member} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        let guild = await Guild.findOneBy({id: guildId});
        if (!guild) {
            guild = new Guild(guildId);
        }
        if (!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command",
            });
            return;
        }
        await interaction.deferReply();

        // get the command parameters
        const poolUuids = ensure(options.getString("pool_uuids")).split(",");
        const deletePoolResponses: string[] = [];
        const deletePoolPromises = [];

        for (const poolUuid of poolUuids) {
            // Invalid input was provided by the user
            if (!Number(poolUuid)) {
                deletePoolResponses.push(`Error: Pool with id ${poolUuid} should be a number!`);
                interaction.editReply(deletePoolResponses.join("\n"));
                continue;
            }

            deletePoolPromises.push(deletePool(Number(poolUuid), guildId)
                .then(deletePoolResponse => {
                    deletePoolResponses.push(deletePoolResponse);
                    interaction.editReply(deletePoolResponses.join("\n"));
                }));
        }

        await Promise.all(deletePoolPromises)
            .then(() => interaction.editReply(deletePoolResponses.join("\n")));
    },
} as ICommand;