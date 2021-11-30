import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, AmplifyProvider, Button, Loader,
  Collection, Card, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { API } from 'aws-amplify';
import Footer from './Footer';
import { Matchup, Team } from './types';
import { getTeamFromId } from './utilities';
import './base.css';
import config from './aws-exports';
Amplify.configure(config);

interface AppProps {
  signOut: Function,
  user: any
}


function App({ signOut, user }: AppProps) {
  const [teams, setTeams] = useState<[Team] | null>(null);
  const [currentMatchup, setCurrentMatchup] = useState<Matchup | null>(null);
  useEffect(() => {
    getMatchup('current');
    getTeams();
  }, [])

  async function getTeams() {
    try{
      const data = await API.get('fantraxBasketball', '/teams', '');
      setTeams(data.data);
    } catch (err) {
      console.log('error:', err);
    }
  }

  async function getMatchup(id:string|number) {
    try{
      const data = await API.get('fantraxBasketball', `/matchup/${id}`, '');
      setCurrentMatchup(data.data);
    } catch (err) {
      console.log('error:', err);
    }
  }

  if (!currentMatchup || !teams) {
    return <Loader />
  } else {
    return (
      <AmplifyProvider>
        <Button
        loadingText=""
        onClick={() => signOut()}
        ariaLabel=""
      >
        Sign Out
      </Button>
      <Heading level={1}>Matchup {currentMatchup.id} </Heading>
      <Heading level={2}>Hello {user.attributes.email} </Heading>
      <Collection
        type="list"
        items={currentMatchup.games}
        gap="1.5rem"
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
      >
        {(item, index) => {
          const visitor = getTeamFromId(teams, item.visitor_team);
          const home = getTeamFromId(teams, item.home_team);
          console.log(item.visitor_team, visitor, item.home_team, home);
          return (
            <Card key={index} padding="1rem">
              <Heading level={4}>{ visitor.abbreviation } @ { home.abbreviation } </Heading>
              <Text>{item.date}</Text>
            </Card>
          )
        }}
      </Collection>
        <Footer totalPages={21} callback={getMatchup} initialPage={currentMatchup.id}/>
      </AmplifyProvider>
    );
  }
}

export default withAuthenticator(App);
