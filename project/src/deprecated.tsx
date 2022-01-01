/* methods not needed at the moment but might again */
import { API } from 'aws-amplify';

export async function callApi() {
    try{
        const data = await API.get('fantraxBasketball', '/create-schedule', '');
    } catch (err) {
        console.log('error:', err);
    }
}

export async function getMatchups() {
    try{
      const data = await API.get('fantraxBasketball', '/matchup-dates', '');
    } catch (err) {
      console.log('error:', err);
    }
  }