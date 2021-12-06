import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, Grid, AmplifyProvider, Loader, Tabs, TabItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Header from './Header';
import PlayerCollection from './SetGames/PlayerCollection';
import EditPlayers from './EditPlayers/EditPlayers';
import { Matchup, Roster, Team } from './types';
import { getMatchup, getTeams, getPlayers } from './services';
import './base.css';
import config from './aws-exports';
Amplify.configure(config);

interface AppProps {
  signOut: Function,
  user: any
}

function App({ signOut, user }: AppProps) {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [currentMatchup, setCurrentMatchup] = useState<Matchup | null>(null);
  const [roster, setRoster] = useState<Roster | null>(null);
  useEffect(() => {
    getPlayers(setRoster)
    getMatchup('current', setCurrentMatchup);
    getTeams(setTeams);
  }, [])

  if (!currentMatchup || !teams || !roster) {
    return <Loader />
  } else {
    return (
      <AmplifyProvider>
        <Grid
          // templateRows=".25fr 1fr 5fr 1fr"
          // templateColumns="1fr"
        >
          <Header user={user} signOut={signOut} currentMatchup={currentMatchup} />
          <Tabs>
            <TabItem title="Set Games">
              <PlayerCollection 
                setCurrentMatchup={setCurrentMatchup}
                currentMatchup={currentMatchup}
                roster={roster}
                teams={teams} />
            </TabItem>           
            <TabItem title="Add/Remove Player">
              <EditPlayers
                currentMatchup={currentMatchup}
                roster={roster}
                setRoster={setRoster}
              />  
            </TabItem>
          </Tabs>   
        </Grid>
      </AmplifyProvider>
    );
  }
}

export default withAuthenticator(App);
