import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {setPhrase} from "../abstract_commands/set_phrase";
import {ensure} from "../utils/general";

export default {
    category: "User",
    description: "Set a phrase when joining a queue",

    slash: true,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: "queue_uuid",
            description: "The id of the queue",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: true,
        },
        {
            name: "phrase",
            description: "The phrase to set",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],

    callback: async ({interaction}) => {
        const {options, channelId, guildId, user} = interaction;

        const queueUuid = ensure(options.getInteger("queue_uuid"));
        const phrase = ensure(options.getString("phrase"));

        if (!guildId) {
            return "This command can only be run in a server";
        }

        return await setPhrase(user.id, queueUuid, phrase, guildId);
    },
} as ICommand;