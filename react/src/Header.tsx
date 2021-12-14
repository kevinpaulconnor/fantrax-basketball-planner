import React, { useState } from 'react';
import { Flex, Button, Heading, Text, Loader, useTheme } from '@aws-amplify/ui-react';
import { Matchup } from './types'; 
import { createSchedule } from './services';

interface HeaderProps {
    currentMatchup: Matchup,
    user: any,
    signOut: Function,
    saved: String | null,
}

const Header = ({signOut, user, saved, currentMatchup} :HeaderProps) => {
    const [loading, setLoading] = useState(false);
    const { tokens } = useTheme();
    return (
        <React.Fragment>
            <Flex
            alignItems="center"
            justifyContent="end"
        >
            {loading && <Loader />}
            {saved && <Text color={tokens.colors.green[60]}>{saved}</Text>}
            <Text>(last modified {new Date(currentMatchup.lastModified).toLocaleString()})</Text> 
            <Button
            loadingText=""
            onClick={() => {
                setLoading(true);
                createSchedule(() => {
                    window.location.reload();
                    setLoading(false)
    ;               }
                )
            }}
            ariaLabel=""
            color={tokens.colors.red[90]}
            >
            Refresh Schedule (!)
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
        <Heading level={1}>Matchup {currentMatchup.id}: {currentMatchup.opponent} </Heading>
      </React.Fragment>
    )
}

export default Header;