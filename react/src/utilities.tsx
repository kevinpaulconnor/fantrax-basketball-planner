import { Team, Player } from "./types";

export function getTeamFromId(teams: Team[], id: number) :Team {
    return teams[id-1];
}

export const formatPlayerString = (player:Player) => {
    return `${player.first_name} ${player.last_name}, ${player.position}, ${player.team.full_name}`;
}

export const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};