import { Team } from "./types";

export function getTeamFromId(teams: [Team], id: number) :Team {
    return teams[id-1];
}