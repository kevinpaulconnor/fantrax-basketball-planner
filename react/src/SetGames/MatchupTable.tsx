import React from 'react';
import { Collection, Card, Heading, Text } from '@aws-amplify/ui-react';
import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
  } from '@aws-amplify/ui-react';
import PlayerRow from './PlayerRow';
import { getTeamFromId } from '../utilities';
import { getMatchup } from '../services';
import { Matchup, Team, Roster } from '../types';

interface MatchupTableProps {
    setCurrentMatchup: Function,
    currentMatchup: Matchup,
    roster: Roster,
    teams: Team[]
}

const MatchupTable = ({teams, currentMatchup, roster, setCurrentMatchup} :MatchupTableProps) => {
    const callback = (id: number) => {
        getMatchup(id, setCurrentMatchup);
    }
    console.log(roster);
    return (
    //     <Collection
    //     type="list"
    //     items={currentMatchup.games}
    //     gap="1.5rem"
    //     direction="row"
    //     justifyContent="space-between"
    //     wrap="wrap"
    // >
    //     {(item, index) => {
    //     const visitor = getTeamFromId(teams, item.visitor_team);
    //     const home = getTeamFromId(teams, item.home_team);
    //     return (
    //         <Card key={index} padding="1rem">
    //         <Heading level={4}>{ visitor.abbreviation } @ { home.abbreviation } </Heading>
    //         <Text>{item.date}</Text>
    //         </Card>
    //     )
    //     }}
    // </Collection>

      
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">Player</TableCell>
              <TableCell as="th">M</TableCell>
              <TableCell as="th">T</TableCell>
              <TableCell as="th">W</TableCell>
              <TableCell as="th">Th</TableCell>
              <TableCell as="th">F</TableCell>
              <TableCell as="th">Sa</TableCell>
              <TableCell as="th">Su</TableCell>
              <TableCell as="th">Change Roster Status</TableCell>
              <TableCell as="th">Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th">Should Play</TableCell>
            </TableRow>
            <PlayerRow
                setCurrentMatchup={setCurrentMatchup}
                currentMatchup={currentMatchup}
                player={roster.players[0]}
                teams={teams}
            />
            <TableRow>
              <TableCell as="th">Could Play</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th">Should Not Play</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    )
}

export default MatchupTable;