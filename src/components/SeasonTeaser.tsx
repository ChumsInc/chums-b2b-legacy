import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Box, {BoxProps} from "@mui/material/Box";
import {styled} from "@mui/material/styles";


const NewIcon = styled(InfoIcon)`
    color: var(--chums-red);
    margin-right: 0.5rem;
`;

export interface SeasonTeaserProps extends BoxProps {
    season_teaser?: string|null;
    season_active?: boolean | null;
}
const SeasonTeaser = ({season_teaser, season_active, sx, ...rest}: SeasonTeaserProps) => {
    const show: boolean = !!season_active && !!season_teaser;
    if (!show) {
        return null;
    }

    return (
        <Box className="season-teaser"
             sx={{verticalAlign: 'center', display: 'flex', alignItems: 'center', my: 1, ...sx}}
             {...rest}>
            <NewIcon/>
            <span>{season_teaser}</span>
        </Box>
    );
};

export default SeasonTeaser;
