import { useState } from 'react';
import { Card, Flex, TextField, Heading, 
    Text, Loader, CheckboxField, IconClose, useTheme } from '@aws-amplify/ui-react';
import { findPlayers, postPlayers, getPlayers } from '../services';
import { debounce } from '../utilities';
import { Matchup, Player, Roster } from '../types'; 

interface EditPlayersProps {
    currentMatchup: Matchup,
    roster: Roster,
    setRoster: Function
}

const EditPlayers = ({ currentMatchup, roster, setRoster } :EditPlayersProps) => {
    const { tokens } = useTheme();
    const [loading, setLoading] = useState(false);
    const [possiblePlayers, setPossiblePlayers] = useState<Player[] | null>(null);
    const labelFormat = (player:Player) => {
        return `${player.first_name} ${player.last_name}, ${player.position}, ${player.team.full_name}`;
    }
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
        const id = parseInt(e.currentTarget.value);
        const newPlayer = possiblePlayers?.find(player => player.id === id);
        if (newPlayer) {
            const newRoster = [...roster.players];
            newRoster.push(newPlayer);
            await postPlayers(newRoster, (e:any) => getPlayers(setRoster))
        }
        setLoading(false);
    }

    const handleDelete = async (e:React.MouseEvent<HTMLDivElement>) => {
        setLoading(true);
        let id = e.currentTarget.getAttribute("data-playerid");
        if (id) {
            let parsedId = parseInt(id);
            const newRoster = roster.players.filter(player => player.id !== parsedId);
            if (newRoster) {
                await postPlayers(newRoster, (e:any) => getPlayers(setRoster))
            }
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
            ret.push(<div key={player.id}
                onClick={handleDelete}
                data-playerid={player.id}
            >
                {labelFormat(player)}
                <IconClose
                    color={tokens.colors.red[100]}
                />
            </div>);
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