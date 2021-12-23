import { useState, useEffect, useReducer } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, Grid, AmplifyProvider, Loader, Tabs, TabItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Header from './Header';
import MatchupTable from './SetGames/MatchupTable';
import Footer from './SetGames/Footer';
import SelectedCount from './SelectedCount';
import EditPlayers from './EditPlayers/EditPlayers';
import { Matchup, Roster, Team, 
  Player, AppState, AppStateAction, AppStateActionKind, RosterStatus } from './types';
import { getMatchup, getTeams, getPlayers, postPlayers } from './services';
import './base.css';
import config from './aws-exports';
import { generatePlayerRows } from './utilities';
Amplify.configure(config);

interface AppProps {
  signOut: Function,
  user: any
}

function App({ signOut, user }: AppProps) {
  const [saved, setSaved] = useState<String | null>(null);
  const initialState = {
    currentMatchup: undefined,
    roster: undefined,
    teams: undefined
  };
  const [appState, dispatch] = useReducer(reducer, initialState);
  const {currentMatchup, roster, teams} = appState;

  const setRoster = (data :Roster) => dispatch({type: AppStateActionKind.SETPLAYERS, roster: data});
  const setMatchup = (data:Matchup) => dispatch({type: AppStateActionKind.SETMATCHUP, matchup: data});

  useEffect(() => {
    getPlayers(setRoster);
    getMatchup('current', setMatchup);
    getTeams((data: Team[]) => dispatch({type: AppStateActionKind.SETTEAMS, teams: data}));
  }, [])

  function reducer(state: AppState, action: AppStateAction) : AppState {
    switch (action.type) {
      case AppStateActionKind.SETPLAYERS:
        return {...state, roster: action.roster};
      case AppStateActionKind.SETMATCHUP:
        return {...state, currentMatchup: action.matchup};
      case AppStateActionKind.SETTEAMS:
        return {...state, teams: action.teams};
      default:
        throw new Error();
    }
  }

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
            <TabItem title={<SelectedCount currentMatchup={currentMatchup} />}>
                <MatchupTable
                    shouldPlayChildren={generatePlayerRows(appState, RosterStatus.SHOULD_PLAY, setMatchup, handlePlayerSave)}
                    couldPlayChildren={generatePlayerRows(appState, RosterStatus.COULD_PLAY, setMatchup, handlePlayerSave)}
                    shouldNotPlayChildren={generatePlayerRows(appState, RosterStatus.SHOULD_NOT_PLAY, setMatchup, handlePlayerSave)}
                />
                <Footer 
                  totalPages={21} 
                  callback={(id: number) => getMatchup(id, setMatchup)}
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
