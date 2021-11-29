import { useState, useEffect } from 'react';
import Amplify from '@aws-amplify/core';
import { withAuthenticator, AmplifyProvider, Button, Loader } from '@aws-amplify/ui-react';
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
      console.log(data);
      //updateGame(data);
    } catch (err) {
      console.log('error:', err);
    }
  }

  async function callApi() {
    try{
      const data = await API.get('fantraxBasketball', '/create-schedule', '');
      console.log(data);
      //updateGame(data);
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
    console.log(currentMatchup);
    return (
      <AmplifyProvider>
        {/* <Button
        loadingText=""
        onClick={getCurrentMatchup}
        ariaLabel=""
      >
        Get Current Matchup
      </Button> */}
        <Footer totalPages={10} initialPage={currentMatchup.id}/>
      </AmplifyProvider>
    );
  }
}

export default withAuthenticator(App);
