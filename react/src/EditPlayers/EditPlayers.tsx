import { useState } from 'react';
import { Card, Flex, TextField, Heading, Text, Loader, CheckboxField } from '@aws-amplify/ui-react';
import { findPlayers, postPlayers } from '../services';
import { debounce } from '../utilities';
import { Matchup, Player, Roster } from '../types'; 

interface EditPlayersProps {
    currentMatchup: Matchup,
    roster: Roster,
    setRoster: Function
}

const EditPlayers = ({ currentMatchup, roster, setRoster } :EditPlayersProps) => {
    const [loading, setLoading] = useState(false);
    const [possiblePlayers, setPossiblePlayers] = useState<Player[] | null>(null);
    const labelFormat = (player:Player) => {
        console.log(player)
        return `${player.first_name} ${player.last_name}, ${player.position}, ${player.team.full_name}`;
    }
    console.log(roster.players)
    const handleChange = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPossiblePlayers(null);
        if (e.target.value.length > 1) {
            setLoading(true);
            await findPlayers(e.target.value, (data: Array<Player>) => {
                /* generally, active(ish) players seem to have position filled in */
                let filteredData = data.filter(elem => elem.position !== '');
    ;           setPossiblePlayers(filteredData.reverse());
                setLoading(false);
            });
        }
    }, 500);

    const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const id = parseInt(e.target.value);
        const player = possiblePlayers?.find(player => player.id === id);
        if (player) {
            await postPlayers([player], (e:any) => console.log(e))
        }
        setLoading(false);
    }

    function renderPossiblePlayers() {
        const ret:JSX.Element[] = [];
        if (possiblePlayers !== null) {
            possiblePlayers.forEach(player => {
                ret.push(<CheckboxField 
                    label={labelFormat(player)} 
                    name={player.id.toString()}
                    key={player.id.toString()}
                    value={player.id.toString()}
                    onChange={handleAdd}
                />);
            });
        }
        if (ret.length === 0 ) {
            ret.push(<Text key="not-found">No players found</Text>)
        }
        return ret;
    }

    const renderCurrentPlayers = () => {
        let ret:JSX.Element[] = [];
        roster.players.forEach(player => {
            ret.push(<div key={player.id}>{labelFormat(player)}</div>);
        })
        return ret;
    }

    return (
        <Card>
            <Flex
                direction="row"
                justifyContent="center"
            >
            <TextField
                label="Find Player"
                descriptiveText="At least two letters. Spaces will work, but put first name first: 'Lebron James' returns results; 'James Lebron' does not"
                onChange={handleChange}
            />
            <Card>
                <Heading level={5}>Current Players</Heading>
                {roster.players && renderCurrentPlayers()}
            </Card>
            </Flex>

            <Card>
                {possiblePlayers !== null && !loading &&
                    renderPossiblePlayers()
                }
                {loading && <Loader />}
            </Card>
        </Card>
    )
}

export default EditPlayers;