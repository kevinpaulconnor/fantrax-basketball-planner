import React from 'react';
import { Flex, Button, Heading, Text } from '@aws-amplify/ui-react';
import { Matchup } from './types'; 

interface HeaderProps {
    currentMatchup: Matchup,
    user: any,
    signOut: Function
}


const Header = ({signOut, user, currentMatchup} :HeaderProps) => {
    return (
        <React.Fragment>
            <Flex
            alignItems="center"
            justifyContent="end"
        >
            <Button
            loadingText=""
            onClick={() => signOut()}
            ariaLabel=""
            >
            Add Player
            </Button>
            <Button
            loadingText=""
            onClick={() => signOut()}
            ariaLabel=""
            >
            Sign Out
            </Button>
            <Text>Hello {user.attributes.email} </Text>
        </Flex>
        <Heading level={1}>Matchup {currentMatchup.id} </Heading> 
      </React.Fragment>
    )
}

export default Header;