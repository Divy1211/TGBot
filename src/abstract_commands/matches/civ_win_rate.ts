import {Match} from "../../entities/matches/Match";
import {Civ} from "../../interfaces/Civ";

export async function civWinRate(civ: Civ) {
    const matches = await Match.find({
        relations: {
            players: true,
        }
    });

    let wins = 0;
    for(const match of matches) {
        for(const player of match.winningTeamPlayers) {
            if(player.civ === civ) {
                ++wins;
                break;
            }
        }
    }

    return Math.floor(wins/matches.length * 100)/100;
}