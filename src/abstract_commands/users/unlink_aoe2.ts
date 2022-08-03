import {AoE2Link} from "../../entities/user_data/AoE2Link";

/**
 * Link someone's discord account to their steam/aoe2.net profile
 *
 * @param discordId The ID of the user to link
 */
export async function unlinkAoE2(discordId: string) {
    const aoe2link = await AoE2Link.findOneBy({user: {discordId}});
    await aoe2link?.remove();

    return `Unlinked successfully`;
}