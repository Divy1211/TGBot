import {MessageActionRow, MessageButton, MessageComponentInteraction} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {ICommand} from "wokcommands";
import {Leaderboard} from "../../entities/queues/Leaderboard";
import {User} from "../../entities/User";

export default {
    category: "General",
    description: "This command resets the ratings of all the users in the server back to the default 1000.",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "user",
            description: "If specified, reset the ratings only for this user",
            type: ApplicationCommandOptionTypes.USER,
            required: false,
        },
        {
            name: "leaderboard_uuid",
            description: "If specified, reset the ratings only for this leaderboard.",
            type: ApplicationCommandOptionTypes.INTEGER,
            required: false,
        },
    ],

    callback: async ({interaction, channel}) => {
        const {options, channelId, guildId} = interaction;

        // ensure that the command is being run in a server
        if (!channelId || !guildId) {
            return "This command can only be run in a text channel in a server";
        }

        // get the command parameters
        const userAPI = options.getUser("user") ?? null;
        let user:any;
        if (userAPI !== null){
            user = await User.findOneBy({discordId:userAPI!.id})
        }
        const leaderboard_uuid = options.getInteger("leaderboard_uuid") ?? null;
        let leaderboard: any;

        if (leaderboard_uuid !== null) {
            leaderboard = await Leaderboard.findOneBy({uuid: leaderboard_uuid});
            if (leaderboard === null) {
                return `Leaderboard with id ${leaderboard_uuid} does not exist`;
            }
        }

        // create embedded message for users to confirm their action
        const row = new MessageActionRow()
            .setComponents(
                new MessageButton()
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                    .setCustomId('cancel'),
                new MessageButton()
                    .setLabel('Confirm')
                    .setStyle('DANGER')
                    .setCustomId('confirm'),
            )
        const confirmMsg = await interaction.reply({
            content: "Are you sure you want to reset rating values?",
            components: [row],
            fetchReply: true
        })

        const filter = (i: MessageComponentInteraction) => {
            return i.user.id === interaction.user.id
        };


        let collector = channel.createMessageComponentCollector({filter, max: 1});

        collector.on("collect", async (btnInt) => {
            if (!btnInt) {
                return;
            }
            await btnInt.deferUpdate();
            if (btnInt.customId === "cancel") {
                return;
            } else if (btnInt.customId === "confirm") {
                // leaderboard uuid is not provided
                if (!leaderboard) {
                    let leaderboards = await Leaderboard.find();
                    // user is not provided
                    if (!user) {
                        for (let leaderboard of leaderboards) {
                            let playerStats = leaderboard.playerStats;
                            for (let playerStat of playerStats){
                                playerStat.rating = 1000;
                                await playerStat.save();
                            }
                        }
                    }
                    // otherwise
                    else {
                        for (let leaderboard of leaderboards) {
                            let playerStats = leaderboard.playerStats;
                                for (let playerStat of playerStats){
                                    if (playerStat.user === user){
                                        playerStat.rating = 1000;
                                        await playerStat.save();
                                    }
                                }
                        }
                    }
                } else {
                    let playerStats = leaderboard.playerStats;
                    if (!user){
                        for (let playerStat of playerStats){
                            playerStat.rating = 1000;
                            await playerStat.save();
                        }
                    }
                    else {
                        for (let playerStat of playerStats){
                            if (playerStat.user === user){
                                playerStat.rating = 1000;
                                await playerStat.save();
                            }
                        }
                    }
                }

                await interaction.followUp(`The rating value has been set.`);
            }
        })
    }
} as ICommand;
