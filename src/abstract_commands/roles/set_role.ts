import {Guild} from "../../entities/Guild";

/**
 * Sets the given role in the guild
 *
 * @param guildId The ID of server in which the role needs to be set
 * @param role which role property to set
 * @param roleId The ID of the role to be set
 */
export async function setRole (guildId: string, role: "admin" | "mod" | "promotion", roleId?: string): Promise<string> {
    let guild = await Guild.findOneBy({id: guildId});
    if (!guild) {
        guild = new Guild(guildId);
    }

    guild[`${role}RoleId`] = roleId ?? null;
    await guild.save();

    if (!roleId) { return `The ${role} role for the server has been unset.`; }

    return `Role <@&${roleId}> has been set as the ${role} role.`;
}
