import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {createMap} from "../../abstract_commands/pools/create_map";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isAdmin} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Create a map",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "name",
            description: "The name of the map",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "img_link",
            description: "The link to an external image preview of the map",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
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
        if(!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command"
            })
            return;
        }

        // get the command parameters
        const name = ensure(options.getString("name")).replace("@", "\\@");
        const imgLink = options.getString("img_link") ?? undefined;

        return await createMap(guildId, name, imgLink);
    },
} as ICommand;