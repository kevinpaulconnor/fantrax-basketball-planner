import { API } from 'aws-amplify';

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