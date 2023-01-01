import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";

import {editPool} from "../../abstract_commands/pools/edit_pool";
import {ensure} from "../../utils/general";
import {Guild} from "../../entities/Guild";
import {isAdmin} from "../../abstract_commands/permissions";
import {GuildMember} from "discord.js";

export default {
    category: "Admin",
    description: "Edit the name of a pool in the server",
    slash: true,
    testOnly: false,
    guildOnly: true,

    options: [
        {
            name: "uuid",
            description: "The uuid of the pool to modify",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "name",
            description: "The new name of the pool",
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
        if(!isAdmin(member as GuildMember, guild)) {
            await interaction.reply({
                ephemeral: true,
                content: "Only admins are allowed to use this command"
            })
            return;
        }

        // get the command parameters
        const poolUuid = ensure(options.getInteger("uuid"));
        let name = options.getString("name") ?? undefined;

        if(name) {
            name = name.replace("@", "\\@");
        }
        return await editPool(guildId, poolUuid, name);
    },
} as ICommand;