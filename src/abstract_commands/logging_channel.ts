import {TextBasedChannel} from "discord.js";
import {Guild} from "../entities/Guild";

/**
 * Sets the logging channel for the given guild to the specified channel
 *
 * @param guildId The ID of the server to set the logging channel for
 * @param channelId The ID of the channel to set as the logging channel
 * @param channel The channel object
 */
export async function setLoggingChannel(
    guildId: string, channelId: string, channel: TextBasedChannel): Promise<string> {
    if (!channel.isText())
        return "Error: Only a text channel can be set as the logging channel";

    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    guild.loggingChannelId = channelId;

    await guild.save();

    return "This channel has been successfully set as the logging channel for command usages on this server!";
}