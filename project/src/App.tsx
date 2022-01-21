import { useState, useEffect, useReducer } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, Button, Grid, AmplifyProvider, Loader, Tabs, TabItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Header from './Header';
import MatchupTable from './SetGames/MatchupTable';
import Footer from './SetGames/Footer';
import SelectedCount from './SelectedCount';
import EditPlayers from './EditPlayers/EditPlayers';
import { Matchup, Roster, Team, 
  Player, AppState, AppStateAction, AppStateActionKind, RosterStatus } from './types';
import { getMatchup, getTeams, getPlayers, postPlayers, createSchedule} from './services';
import './base.css';
import config from './aws-exports';
import { generatePlayerRows, stats } from './utilities';
Amplify.configure(config);

interface AppProps {
  signOut: Function,
  user: any
}

function App({ signOut, user }: AppProps) {
  const [saved, setSaved] = useState<String | null>(null);
  const initialState = {
    error: false,
    currentMatchup: undefined,
    currentStat: 0,
    roster: undefined,
    teams: undefined
  };
  const [appState, dispatch] = useReducer(reducer, initialState);
  const {currentMatchup, roster, teams, error} = appState;

  const handler = (error: boolean, action: AppStateAction) => {
    if (error) {
      dispatch({type: AppStateActionKind.SETERROR, error: true});
    } else {
      dispatch(action)
    }
  }

  const setRoster = (data :Roster) => dispatch({type: AppStateActionKind.SETPLAYERS, roster: data});
  const setMatchup = (data :Matchup, error: boolean) => handler(error, {type: AppStateActionKind.SETMATCHUP, matchup: data});
  const setCurrentStat = () => {
    let statToSet = appState.currentStat! + 1;
    if (statToSet === stats.length) {
      statToSet = 0;
    }
    dispatch({
      type: AppStateActionKind.SETSTAT,
      stat: statToSet,
    });
  }

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
      case AppStateActionKind.SETSTAT:
        return {...state, currentStat: action.stat};
      case AppStateActionKind.SETTEAMS:
        return {...state, teams: action.teams};
      case AppStateActionKind.SETERROR:
        return {...state, error: true};
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
  if (error) {
    return (
      <Button
        loadingText=""
        onClick={() => {
            createSchedule(() => {
                window.location.reload();
  ;               }
            )
        }}
        ariaLabel=""
        >
        There has been a Data Error, Refresh Schedule (!)
      </Button>
    )
  } else if (!currentMatchup || !teams || !roster) {
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
                  currentStat={appState.currentStat}
                  setCurrentStat={setCurrentStat}
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
