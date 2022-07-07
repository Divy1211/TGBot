import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import { Guild } from "../../entities/Guild";
import { ensure } from "../../utils/general";

export default {
    category: "General",
    description: "Set a role as moderate role for the server",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "role",
            description: "a role",
            type: ApplicationCommandOptionTypes.ROLE,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const role = ensure(options.getRole("role"));

        const guild = await Guild.findOneBy({id:guildId}) || undefined;
        if (guild != undefined){
            guild.modRoleId = role?.id.toString();
            guild.save()
            return `Role ${role!.name} has been set to moderate role.`;
        }

    },
} as ICommand;