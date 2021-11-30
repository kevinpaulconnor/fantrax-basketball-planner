export type Team = {
    abbreviation: string,
    city: string,
    conference: string,
    division: string,
    full_name: string,
    id: number,
    name: string
}

export type Game = {
    id: number,
    date: Date,
    home_team: number,
    home_team_score: number,
    status: string,
    visitor_team: number,
    visitor_team_score: number
};

export type Matchup = {
    games: Array<Game>,
    id: number
};