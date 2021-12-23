export interface AppState {
    currentMatchup: Matchup | undefined,
    roster: Roster | undefined,
    teams: Team[] | undefined,
}

export interface AppStateAction {
    type: AppStateActionKind,
    roster?: Roster,
    matchup?: Matchup,
    teams?: Team[]
}

export enum AppStateActionKind {
    SETPLAYERS = "SETPLAYERS",
    SETMATCHUP = "SETMATCHUP",
    SETTEAMS = "SETTEAMS",
}   

export enum RosterStatus {
    SHOULD_PLAY = "Should Play",
    COULD_PLAY =  "Could Play",
    SHOULD_NOT_PLAY =  "Should Not Play",
}

export type Player = {
    id: number,
    first_name: string,
    last_name: string,
    position: string,
    team: Team,
    status: RosterStatus,
    notes: string,
}

export type Roster = {
    players: Player[],
    lastModified: string,
}

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
    opponent: string,
    selectedGames: {
        playerId: number,
        gameId: number,
        index: number,
    }[],
    start: Date,
    end: Date,
    lastModified: string,
    id: number
};