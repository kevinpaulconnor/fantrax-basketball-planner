import React from 'react';
import { Collection, Card, Heading, Text } from '@aws-amplify/ui-react';
import { getTeamFromId } from './utilities';
import Footer from './Footer';
import { getMatchup } from './services';
import { Matchup, Team } from './types';

interface PlayerCollectionProps {
    currentMatchup: Matchup,
    teams: [Team]
}

const PlayerCollection = ({teams, currentMatchup} :PlayerCollectionProps) => {
    return (
        <React.Fragment>
            <Collection
            type="list"
            items={currentMatchup.games}
            gap="1.5rem"
            direction="row"
            justifyContent="space-between"
            wrap="wrap"
        >
            {(item, index) => {
            const visitor = getTeamFromId(teams, item.visitor_team);
            const home = getTeamFromId(teams, item.home_team);
            return (
                <Card key={index} padding="1rem">
                <Heading level={4}>{ visitor.abbreviation } @ { home.abbreviation } </Heading>
                <Text>{item.date}</Text>
                </Card>
            )
            }}
        </Collection>
        <Footer totalPages={21} callback={getMatchup} initialPage={currentMatchup.id}/>
      </React.Fragment>
    )
}

export default PlayerCollection;