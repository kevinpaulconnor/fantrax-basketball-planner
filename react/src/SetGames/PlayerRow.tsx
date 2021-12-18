import React from 'react';
import {
    TableCell,
    TableRow,
    TextField,
    useTheme,
    SelectField,
  } from '@aws-amplify/ui-react';
import { formatPlayerString, debounce } from '../utilities';
import '../base.css';
import { AppState, Player, RosterStatus } from '../types';
import PlayerGameDay from './PlayerGameDay';

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
    player: Player,
    appState: AppState
}

const PlayerRow = ({appState, player, setPlayer, setCurrentMatchup} :PlayerRowProps) => {
    const handleNotesChange = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayer = { ...player };
        newPlayer.notes = e.target.value;
        setPlayer(newPlayer);
    });
    let gameDays = [];
    for (var i = 0; i < 7; i++) {
        gameDays.push(<PlayerGameDay 
            daysFromMatchupStart={i}
            selected={false} 
            appState={appState}
            player={player}
            setCurrentMatchup={setCurrentMatchup}
        />)
    }

    return (    
        <TableRow>
            <TableCell>
                {formatPlayerString(player)}
            </TableCell>
            {gameDays}
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