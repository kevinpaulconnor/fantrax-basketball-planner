import { Flex, Text, useTheme } from '@aws-amplify/ui-react';
import { Matchup } from './types';

interface SelectedCountProps {
    currentMatchup: Matchup,
}

const SelectedCount = ({ currentMatchup } :SelectedCountProps) => {
    const { tokens } = useTheme();
    const totalMatchupGames = 41;

    return (
        <Flex>
        <Text fontWeight={tokens.fontWeights.bold}>Select Games:</Text>
        <Text
            fontWeight={tokens.fontWeights.bold}
            color={tokens.colors.yellow[60]}
        >
            {currentMatchup.selectedGames.length}
        </Text> 
        <Text fontWeight={tokens.fontWeights.bold}> / {totalMatchupGames}</Text>
    </Flex>
    )
}

export default SelectedCount;