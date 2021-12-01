import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, Grid, AmplifyProvider, Loader,
  Collection, Card, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Footer from './Footer';
import Header from './Header';
import { Matchup, Team } from './types';
import { getTeamFromId } from './utilities';
import { getMatchup, getTeams } from './services';
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
    getMatchup('current', setCurrentMatchup);
    getTeams(setTeams);
  }, [])

  if (!currentMatchup || !teams) {
    return <Loader />
  } else {
    return (
      <AmplifyProvider>
        <Grid
          templateRows=".25fr 1fr 5fr 1fr"
          templateColumns="1fr"
        >
          <Header user={user} signOut={signOut} currentMatchup={currentMatchup} />
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
              return (
                <Card key={index} padding="1rem">
                  <Heading level={4}>{ visitor.abbreviation } @ { home.abbreviation } </Heading>
                  <Text>{item.date}</Text>
                </Card>
              )
            }}
          </Collection>
          <Footer totalPages={21} callback={getMatchup} initialPage={currentMatchup.id}/>
        </Grid>
      </AmplifyProvider>
    );
  }
}

export default withAuthenticator(App);
