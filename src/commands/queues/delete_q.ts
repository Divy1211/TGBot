import {GuildMember} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {isAdmin} from "../../abstract_commands/permissions";
import {deleteQueue} from "../../abstract_commands/queues/delete";
import {Guild} from "../../entities/Guild";
import {ensure} from "../../utils/general";


export default {
    category: "Admin",
    description: "Delete a TG pickup queue in this channel",

    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "uuids",
            description: "Comma spearated list of Id's of the queue to delete",
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
        const qUuids = ensure(options.getString("uuids")).split(",");
        const deleteQueueResponses: string[] = [];
        const deleteQueuePromises = [];

        for (const queueUuid of qUuids) {
            // Invalid input was provided by the user
            if (!Number(queueUuid)) {
                deleteQueueResponses.push(`Error: Queue with id ${queueUuid} should be a number!`);
                interaction.editReply(deleteQueueResponses.join("\n"));
                continue;
            }

            deleteQueuePromises.push(deleteQueue(Number(queueUuid), guildId)
                .then(response => {
                    deleteQueueResponses.push(response);
                    interaction.editReply(deleteQueueResponses.join("\n"));
                }));
        }

        await Promise.all(deleteQueuePromises)
            .then(() => interaction.editReply(deleteQueueResponses.join("\n")));
    },
} as ICommand;
