import {Match} from "../../entities/matches/Match";
import {Civ} from "../../interfaces/Civ";

export async function civWinRate(civ: Civ) {
    const matches = await Match.find({
        relations: {
            players: true,
        }
    });

    let wins = 0;
    let losses = 0;
    for(const match of matches) {
        for(const player of match.winningTeamPlayers) {
            if(player.civ === civ) {
                ++wins;
                break;
            }
        }
        for(const player of match.losingTeamPlayers) {
            if(player.civ === civ) {
                ++losses;
                break;
            }
        }
    }

    return Math.floor(wins/(wins+losses)*100)/100;
}