import { API } from 'aws-amplify';
import { Player, Matchup } from './types';

/* API ajax methods to Amplify api */
async function baseAPIFetch(endpoint:string, callback:Function) {
    try{
        const data = await API.get('fantraxBasketball', endpoint, '');
        callback(data.data);
    } catch (err) {
        callback(err, true);
        console.log('error:', err);
    }
}

export async function createSchedule(callback:Function) {
    baseAPIFetch(`/create-schedule`, callback);
}

export async function getMatchup(id:string|number, callback:Function) {
    baseAPIFetch(`/matchup/${id}`, callback);
}

export async function getTeams(callback:Function) {
    baseAPIFetch(`/teams`, callback);
}

export async function getPlayers(callback:Function) {
    baseAPIFetch(`/players`, callback);
}

export async function updatePlayerStats(callback:Function) {
    baseAPIFetch(`/updatePlayerStats`, callback);
}

export async function findPlayers(value:string, callback:Function) {
    baseAPIFetch(`/bdl-proxy/players/?search=${value}&per_page=50`, callback);
}

async function baseAPIPost(endpoint:string, callback:Function, init: any) {
    try{
        const data = await API.post('fantraxBasketball', endpoint, init);
        callback(data.data);
    } catch (err) {
        console.log('error:', err);
    }
}

export async function postPlayers(playersArray: Array<Player>, callback: Function) {
    baseAPIPost(
        '/players', 
        callback, 
        { 
            body: {
                data: playersArray
            }
        }
    );
}

export async function postMatchup(matchup: Matchup, callback: Function) {
    baseAPIPost(
        `/matchup/${matchup.id}`,
        callback, 
        { 
            body: {
                data: matchup
            }
        }
    );
}