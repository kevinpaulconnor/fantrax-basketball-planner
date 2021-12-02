import { API } from 'aws-amplify';

/* API ajax methods to Amplify api */
async function baseAPIFetch(endpoint:string, callback:Function) {
    try{
        const data = await API.get('fantraxBasketball', endpoint, '');
        callback(data.data);
    } catch (err) {
        console.log('error:', err);
    }
}

export async function getMatchup(id:string|number, callback:Function) {
    baseAPIFetch(`/matchup/${id}`, callback);
}

export async function getTeams(callback:Function) {
    baseAPIFetch(`/teams`, callback);
}

export async function findPlayers(value:string, callback:Function) {
    baseAPIFetch(`/bdl-proxy/players/?search=${value}&per_page=50`, callback);
}