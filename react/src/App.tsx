import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, AmplifyProvider, Button, Loader,
  Collection, Card, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { API } from 'aws-amplify';
import Footer from './Footer';
import { Matchup } from './types';
import config from './aws-exports';
Amplify.configure(config);

function App() {
  const [currentMatchup, setCurrentMatchup] = useState<Matchup | null>(null);

  useEffect(() => {
    getMatchup('current');
  }, [])

  async function getMatchups() {
    try{
      const data = await API.get('fantraxBasketball', '/matchup-dates', '');
    } catch (err) {
      console.log('error:', err);
    }
  }

  async function callApi() {
    try{
      const data = await API.get('fantraxBasketball', '/create-schedule', '');
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
  if (!currentMatchup) {
    return <Loader />
  } else {
    return (
      <AmplifyProvider>
        {/* <Button
        loadingText=""
        onClick={getCurrentMatchup}
        ariaLabel=""
      >
        Get Current Matchup
      </Button> */}
      <Heading level={1}>Matchup {currentMatchup.id} </Heading>
      <Collection
        type="list"
        items={currentMatchup.games}
        gap="1.5rem"
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
      >
        {(item, index) => (
          <Card key={index} padding="1rem">
            <Heading level={4}>{item.visitor_team} @ {item.home_team} </Heading>
            <Text>{item.date}</Text>
          </Card>
        )}
      </Collection>
        <Footer totalPages={21} callback={getMatchup} initialPage={currentMatchup.id}/>
      </AmplifyProvider>
    );
  }
}

export default withAuthenticator(App);
