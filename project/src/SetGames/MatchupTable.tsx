import React from 'react';
import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
  } from '@aws-amplify/ui-react';

interface MatchupTableProps {
    shouldPlayChildren: React.ReactNode,
    couldPlayChildren: React.ReactNode,
    shouldNotPlayChildren: React.ReactNode,

  }

const MatchupTable = ({shouldPlayChildren, couldPlayChildren, shouldNotPlayChildren} :MatchupTableProps) => {
    return (      
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
              {shouldPlayChildren}
            <TableRow>
              <TableCell as="th">Could Play</TableCell>
            </TableRow>
              {couldPlayChildren}
            <TableRow>
              <TableCell as="th">Should Not Play</TableCell>
            </TableRow>
              {shouldNotPlayChildren}
          </TableBody>
        </Table>
    )
}

export default MatchupTable;