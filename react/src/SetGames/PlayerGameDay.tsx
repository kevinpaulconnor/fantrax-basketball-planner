import {
    TableCell,
    useTheme,
  } from '@aws-amplify/ui-react';
import { getTeamFromId } from '../utilities';
import { getMatchup, postMatchup } from '../services';
import '../base.css';
import { Player, AppState } from '../types';

interface PlayerGameDayProps {
    daysFromMatchupStart: number,
    selected: boolean,
    player: Player,
    appState: AppState,
    setCurrentMatchup: Function,
}

const PlayerGameDay = ({daysFromMatchupStart, appState, player, setCurrentMatchup, selected} : PlayerGameDayProps) => {
    const { tokens } = useTheme();
    const { teams, currentMatchup } = appState;
    if (currentMatchup && teams) {
        const matchupStart = new Date(currentMatchup.start).toISOString();
        let text = '';
        let found = null;
        let bgColor = tokens.colors.background.primary;
        let matchupDay = new Date(matchupStart);
        matchupDay.setDate(matchupDay.getDate() + daysFromMatchupStart);
        const possible = currentMatchup.games.filter(game => {
            return matchupDay.getUTCDate() === new Date(game.date).getUTCDate() &&
            (game.home_team === player.team.id || game.visitor_team === player.team.id)
        });
        if (possible.length === 1) {
            found = possible[0];
            const visitor = getTeamFromId(teams, found.visitor_team);
            const home = getTeamFromId(teams, found.home_team);
            text = `${visitor.abbreviation} @ ${home.abbreviation}`;
            if (selected) {
                bgColor = tokens.colors.yellow[60];
            }
        }
        return (
            <TableCell
                backgroundColor={bgColor}
                data-playerid={player.id}
                data-gameid={found ? found.id : ''}
                onClick={async (e) => {
                    let playerId = e.currentTarget.getAttribute("data-playerid");
                    let gameId = e.currentTarget.getAttribute("data-gameid");
                    if (playerId && gameId) {
                        let parsedPlayerId = parseInt(playerId);
                        let parsedGameId = parseInt(gameId);
                        const duplicate = currentMatchup.selectedGames.filter(game => {
                            return game.gameId === parsedGameId && game.playerId === parsedPlayerId;
                        });
                        let newMatchup = {...currentMatchup};
                        if (duplicate.length === 0) {
                            newMatchup.selectedGames.push({
                                playerId: parsedPlayerId,
                                gameId: parsedGameId,
                                index: daysFromMatchupStart,
                            })
                        } else {
                            newMatchup.selectedGames = newMatchup.selectedGames.filter(game => {
                                return game.gameId !== parsedGameId && game.playerId !== parsedPlayerId;
                            });
                        }
                        await postMatchup(newMatchup, (e:any) => getMatchup(newMatchup.id, setCurrentMatchup))
                    }
                }}
            >
                {text}
            </TableCell>
            
        );
    } else return <TableCell />;
}

export default PlayerGameDay;