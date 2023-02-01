import {AoE2Link} from "../../entities/user_data/AoE2Link";

/**
 * Link someone's discord account to their steam/aoe2.net profile
 *
 * @param discordId The ID of the user to link
 */
export async function unlinkAoE2 (discordId: string) {
    const aoe2links = await AoE2Link.findBy({user: {discordId}});
    await AoE2Link.remove(aoe2links);

    return "Unlinked successfully";
}
