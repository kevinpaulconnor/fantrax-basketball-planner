import { useState } from 'react';
import { Card, Flex, TextField, Text, Loader, CheckboxField } from '@aws-amplify/ui-react';
import { findPlayers } from '../services';
import { debounce } from '../utilities';
import { Matchup, Player } from '../types'; 

interface AddPlayerProps {
    currentMatchup: Matchup,
}

const AddPlayer = ({ currentMatchup } :AddPlayerProps) => {
    const [loading, setLoading] = useState(false);
    const [possiblePlayers, setPossiblePlayers] = useState<Player[] | null>(null);
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
        const id = e.target.value;
    }

    function renderPossiblePlayers() {
        const ret:JSX.Element[] = [];
        if (possiblePlayers !== null) {
            possiblePlayers.forEach(player => {
                ret.push(<CheckboxField 
                    label={`${player.first_name} ${player.last_name}, ${player.position}, ${player.team.full_name}`} 
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

export default AddPlayer;