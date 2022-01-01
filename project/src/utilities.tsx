import React, { Fragment } from "react";
import { Team, Player, AppState, RosterStatus } from "./types";
import PlayerRow from "./SetGames/PlayerRow";

export function getTeamFromId(teams: Team[], id: number) :Team {
    return teams[id-1];
}

export const formatPlayerString = (player:Player) => {
    return `${player.first_name} ${player.last_name}, ${player.position}, ${player.team.full_name}`;
}

export const generatePlayerRows = (appState: AppState, rosterStatus: RosterStatus, setCurrentMatchup: Function, handlePlayerSave: Function) => {
    const { roster } = appState;
    let ret = <Fragment/>;
    if (roster && roster.players.length > 0) {
        let playerRows :JSX.Element[] = [];
        const filteredPlayers = roster.players.filter(player => player.status === rosterStatus);
        filteredPlayers.forEach(player => {
            playerRows.push(<PlayerRow
                key={player.id}
                setCurrentMatchup={setCurrentMatchup}
                setPlayer={handlePlayerSave}
                appState={appState}
                player={player}
            />)
        })
        ret = <React.Fragment>{playerRows}</React.Fragment>
    }
    return ret;
}

export const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};