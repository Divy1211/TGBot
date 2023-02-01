import {GuildMember, Permissions} from "discord.js";

import {Guild} from "../entities/Guild";

export function isMod (member: GuildMember, guild: Guild) {
    const {modRoleId, adminRoleId} = guild;

    // if a role is set but is not in the guild somehow, unset it
    if (modRoleId && !member.guild.roles.cache.has(modRoleId)) {
        guild.modRoleId = null;
    }
    if (adminRoleId && !member.guild.roles.cache.has(adminRoleId)) {
        guild.adminRoleId = null;
    }

    if (modRoleId || adminRoleId) {
        // someone is a mod if they have either of these roles if they are defined
        return member.roles.cache.some(role => [modRoleId,
            adminRoleId, ].includes(role.id));
    }

    // or if they have this perm
    return member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS);
}

export function isAdmin (member: GuildMember, guild: Guild) {
    const {adminRoleId} = guild;

    // if a role is set but is not in the guild somehow, unset it
    if (adminRoleId && !member.guild.roles.cache.has(adminRoleId)) {
        guild.adminRoleId = null;
    }

    if (adminRoleId) {
        // someone is an admin if they have this role if it is defined
        return member.roles.cache.some(role => role.id === adminRoleId);
    }
    // or if they have this perm
    return member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS);
}
