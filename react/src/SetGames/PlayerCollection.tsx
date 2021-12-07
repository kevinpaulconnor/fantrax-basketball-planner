import React from 'react';
import MatchupTable from './MatchupTable';
import Footer from './Footer';
import { getMatchup } from '../services';
import { Matchup, Team, Roster } from '../types';

interface PlayerCollectionProps {
    setCurrentMatchup: Function,
    currentMatchup: Matchup,
    roster: Roster,
    teams: Team[]
}

const PlayerCollection = ({teams, currentMatchup, roster, setCurrentMatchup} :PlayerCollectionProps) => {
    const callback = (id: number) => {
        getMatchup(id, setCurrentMatchup);
    }
    return (
        <React.Fragment>
            <MatchupTable
                setCurrentMatchup={setCurrentMatchup}
                currentMatchup={currentMatchup}
                teams={teams}
                roster={roster}
            />
        <Footer totalPages={21} callback={callback} initialPage={currentMatchup.id}/>
      </React.Fragment>
    )
}

export default PlayerCollection;