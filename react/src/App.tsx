import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, Grid, AmplifyProvider, Loader, Tabs, TabItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Header from './Header';
import MatchupTable from './SetGames/MatchupTable';
import Footer from './SetGames/Footer';
import PlayerRow from './SetGames/PlayerRow';
import EditPlayers from './EditPlayers/EditPlayers';
import { Matchup, Roster, Team, Player } from './types';
import { getMatchup, getTeams, getPlayers, postPlayers } from './services';
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
  const [saved, setSaved] = useState<String | null>(null);
  useEffect(() => {
    getPlayers(setRoster)
    getMatchup('current', setCurrentMatchup);
    getTeams(setTeams);
  }, [])

  const replacePlayer = (player: Player) :Player[] => {
    let newPlayers :Player[] = [];
    if (roster && roster.players) {
      newPlayers = roster.players.filter(item => item.id !== player.id);
      newPlayers.push(player);
    }
    return newPlayers;
  }

  const handlePlayerSave = async (player: Player) => {
    const newRoster = replacePlayer(player);
    await postPlayers(newRoster, async () => {
      await getPlayers((players:Roster) => {
        setRoster(players);
        setSaved("Roster updated");
        setTimeout(()=> setSaved(null), 2000);
      })
    })
  }
  
  if (!currentMatchup || !teams || !roster) {
    return <Loader />
  } else {
    return (
      <AmplifyProvider>
        <Grid>
          <Header 
            user={user}
            saved={saved}
            signOut={signOut}
            currentMatchup={currentMatchup}
            rosterLastModified={roster.lastModified}
          />
          <Tabs>
            <TabItem title="Set Games">
                <MatchupTable
                    shouldPlayChildren={
                      <PlayerRow
                        setCurrentMatchup={setCurrentMatchup}
                        setPlayer={handlePlayerSave}
                        currentMatchup={currentMatchup}
                        player={roster.players[0]}
                        teams={teams}
                    />
                  }
                />
                <Footer 
                  totalPages={21} 
                  callback={(id: number) => getMatchup(id, setCurrentMatchup)}
                  initialPage={currentMatchup.id}
                />
            </TabItem>           
            <TabItem title="Add/Remove Player">
              <EditPlayers
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
