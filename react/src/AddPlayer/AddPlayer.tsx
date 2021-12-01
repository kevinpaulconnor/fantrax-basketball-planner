import React from 'react';
import { Card, Flex, TextField } from '@aws-amplify/ui-react';
import { debounce } from '../utilities';
import { Matchup } from '../types'; 

interface AddPlayerProps {
    currentMatchup: Matchup,
}

const AddPlayer = ({ currentMatchup } :AddPlayerProps) => {
    const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => 
        console.log(e.target.value)
    , 500);

    return (
        <Card>
            <Flex
                direction="row"
                justifyContent="center"
            >
            <TextField
                label="Find Player"
                descriptiveText="Spaces will work, but put first name first: 'Lebron James' returns results; 'James Lebron' does not"
                onChange={handleChange}
            />
            </Flex>
        </Card>
    )
}

export default AddPlayer;