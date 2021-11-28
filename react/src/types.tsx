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
    games: Array<Game>
};