import React, { useState } from 'react';
import {
    TableCell,
    TableRow,
    TextField,
    useTheme,
    SelectField,
  } from '@aws-amplify/ui-react';
import { getTeamFromId, formatPlayerString, debounce } from '../utilities';
import { getMatchup } from '../services';
import { Matchup, Player, RosterStatus, Team } from '../types';

const StatusSelect = (initial: RosterStatus, player: Player, setPlayer: Function) => {
    const renderOption = (item: RosterStatus) => {
        return <option key={item}>{item}</option>
    }
    const options = Object.values(RosterStatus);
    return (

    <SelectField
      label="Roster Status"
      labelHidden={true}
      value={player.status}
      onChange={(e) => {
        Object.values(RosterStatus).forEach(key => {
          if (key === e.target.value) {
            const newPlayer = { ...player };
            newPlayer.status = e.target.value;
            setPlayer(newPlayer);
          }
        })
      }}
    >
        {options.map(renderOption)}
    </SelectField>);
}

interface PlayerRowProps {
    setCurrentMatchup: Function,
    setPlayer: Function,
    currentMatchup: Matchup,
    teams: Team[],
    player: Player,
}

const PlayerRow = ({currentMatchup, player, teams, setPlayer, setCurrentMatchup} :PlayerRowProps) => {
    const { tokens } = useTheme();
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

    const handleNotesChange = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayer = { ...player };
        newPlayer.notes = e.target.value;
        setPlayer(newPlayer);
    })

    return (    
        <TableRow>
            <TableCell>
                {formatPlayerString(player)}
            </TableCell>
            <TableCell>{playerGameDay(0)}</TableCell>
            <TableCell>{playerGameDay(1)}</TableCell>
            <TableCell>{playerGameDay(2)}</TableCell>
            <TableCell>{playerGameDay(3)}</TableCell>
            <TableCell>{playerGameDay(4)}</TableCell>
            <TableCell>{playerGameDay(5)}</TableCell>
            <TableCell>{playerGameDay(6)}</TableCell>
            <TableCell>{StatusSelect(RosterStatus.COULD_PLAY, player, setPlayer)}</TableCell>
            <TableCell>
                <TextField
                label="Player Notes"
                labelHidden={true}
                defaultValue={player.notes}
                onChange={handleNotesChange}
                />
            </TableCell>
        </TableRow>
    )
}

export default PlayerRow;