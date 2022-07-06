import {EmbedFieldData, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import { Guild } from "../../entities/Guild";

export default {
    category: "General",
    description: "Set a role as admin role for the server",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "rolename",
            description: "a role name",
            type: ApplicationCommandOptionTypes.STRING,
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
        const roleName = options.getString("rolename");
        const role = interaction.guild?.roles.cache.find((r:any) => r.name == roleName);

        if (!role) {
            return `Role ${roleName} does not exist on this channel.`
        }

        const guild = await Guild.findOneBy({id:guildId}) || undefined;
        if (guild != undefined){
            guild.adminRoleId = role?.id.toString();
            guild.save()
            return `Role ${roleName} has been set to admin role.`;
        }

    },
} as ICommand;