import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Box, {BoxProps} from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import ProductAttributeChip from "../ducks/products/components/ProductAttributeChip";
import Stack, {StackProps} from "@mui/material/Stack";


const NewIcon = styled(InfoIcon)`
    color: var(--chums-red);
    margin-right: 0.5rem;
`;

export interface SeasonTeaserProps extends StackProps {
    season_teaser?: string|null;
    season_active?: boolean | null;
}
const SeasonTeaser = ({season_teaser, season_active, ...rest}: SeasonTeaserProps) => {
    const show: boolean = !!season_active && !!season_teaser;
    if (!show) {
        return null;
    }

    return (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" {...rest}>
            <ProductAttributeChip feature="new"/>
            <span>{season_teaser}</span>
        </Stack>
    );
};

export default SeasonTeaser;
