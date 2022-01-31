import React from 'react';
import {
    TableCell,
    TableRow,
    TextField,
    SelectField,
  } from '@aws-amplify/ui-react';
import { formatPlayerString, debounce , stats} from '../utilities';
import '../base.css';
import { AppState, Player, RosterStatus, seasonStats } from '../types';
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
    const { currentStat } = appState;
    const statIndex = stats[currentStat!].id;
    let statValue = 'Not found';
    if (statIndex && player.stats) {
        statValue = player.stats[statIndex as keyof seasonStats].toString();
    }
    const selectedGames = appState.currentMatchup!.selectedGames;
    let gameDays = [];
    for (let i = 0; i < 7; i++) {
        gameDays.push(<PlayerGameDay
            key={i}
            daysFromMatchupStart={i}
            selected={selectedGames.some(game => game.playerId === player.id && game.index === i)} 
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
            <TableCell>
                {statValue}
            </TableCell>
            {gameDays}
            <TableCell>{StatusSelect(RosterStatus.COULD_PLAY, player, setPlayer)}</TableCell>
            <TableCell>
                <TextField
                label="Player Notes"
                fontSize="0.8rem"
                isMultiline={true}
                labelHidden={true}
                defaultValue={player.notes}
                onChange={handleNotesChange}
                />
            </TableCell>
        </TableRow>
    )
}

export default PlayerRow;