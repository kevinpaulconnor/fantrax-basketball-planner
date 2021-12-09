import React, { useState } from 'react';
import {
    TableCell,
    TableRow,
    IconCheckCircle,
    useTheme,
  } from '@aws-amplify/ui-react';
import { getTeamFromId, formatPlayerString } from '../utilities';
import { getMatchup } from '../services';
import { Matchup, Player, Team } from '../types';

interface PlayerRowProps {
    setCurrentMatchup: Function,
    currentMatchup: Matchup,
    teams: Team[],
    player: Player,
}

const PlayerRow = ({currentMatchup, player, teams, setCurrentMatchup} :PlayerRowProps) => {
    const { tokens } = useTheme();
    const [saved, setSaved] = useState(false);
    const matchupStart = new Date(currentMatchup.start).toISOString();
    const playerGameDay = (daysFromMatchupStart:number) => {
        let ret = '';
        let matchupDay = new Date(matchupStart);
        matchupDay.setDate(matchupDay.getDate() + daysFromMatchupStart);
        const possible = currentMatchup.games.filter(game => {
            return matchupDay.getUTCDate() === new Date(game.date).getUTCDate() &&
            (game.home_team === player.team.id || game.visitor_team === player.team.id)
        });
        if (possible.length === 1) {
            const found = possible[0];
            const visitor = getTeamFromId(teams, found.visitor_team);
            const home = getTeamFromId(teams, found.home_team);
            ret = `${visitor.abbreviation} @ ${home.abbreviation}`
        }
        return ret;
    }

    return (    
        <TableRow>
            <TableCell>
                {formatPlayerString(player)}
                <IconCheckCircle color={tokens.colors.green[60]} size="large"/>
            </TableCell>
            <TableCell>{playerGameDay(0)}</TableCell>
            <TableCell>{playerGameDay(1)}</TableCell>
            <TableCell>{playerGameDay(2)}</TableCell>
            <TableCell>{playerGameDay(3)}</TableCell>
            <TableCell>{playerGameDay(4)}</TableCell>
            <TableCell>{playerGameDay(5)}</TableCell>
            <TableCell>{playerGameDay(6)}</TableCell>
            <TableCell>lorem ipsum</TableCell>
            <TableCell>lorem ipsum</TableCell>
        </TableRow>
    )
}

export default PlayerRow;