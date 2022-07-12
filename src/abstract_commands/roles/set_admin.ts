import {APIRole} from "discord-api-types/v10";
import {Role} from "discord.js";
import {Guild} from "../../entities/Guild";


/**
 * Creates a queue with the given name and number of players, in the specified channel and server
 *
 * @param guildId The ID of server in which the admin role to be set
 * @param role The role to be set as admin
 */
export async function setAdminRole(guildId: string, role: Role | APIRole): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    guild.adminRoleId = role.id;
    await guild.save();
    return `Role ${role.name} has been set to admin role.`;
}