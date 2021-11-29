import Amplify from '@aws-amplify/core';
import { withAuthenticator, AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { API } from 'aws-amplify';
import Footer from './Footer';
import config from './aws-exports';
Amplify.configure(config);

function App() {
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

  return (
    <AmplifyProvider>
      <div> a div </div>
      <Footer totalPages={10} initialPage={1}/>
    </AmplifyProvider>
  );
}

export default withAuthenticator(App);
